import os
from supabase import create_client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

SUPABASE_URL = os.getenv('SUPABASE_URL', getattr(settings, 'SUPABASE_URL', None))
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', getattr(settings, 'SUPABASE_SERVICE_ROLE_KEY', None))


def get_google_tokens_for_user(user_id: str):
    """
    Secure backend utility to retrieve Google OAuth tokens for a given user_id.
    Only for internal backend use—never expose tokens to client or public API.
    Returns a dict with access_token, refresh_token, and expiry, or raises Exception on error.
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise Exception('Supabase env vars not set')
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    result = supabase.table('users').select(
        'google_access_token, google_refresh_token, google_token_expiry'
    ).eq('id', user_id).single().execute()
    if getattr(result, 'error', None):
        raise Exception(result.error)
    if not result.data:
        raise Exception('User not found or missing tokens')
    return {
        'google_access_token': result.data.get('google_access_token'),
        'google_refresh_token': result.data.get('google_refresh_token'),
        'google_token_expiry': result.data.get('google_token_expiry'),
    }

class StoreGoogleTokensView(APIView):
    """
    Receives a POST with supabase_user_id (uuid string).
    Fetches Google OAuth tokens from Supabase Auth user identities.
    Stores them in the public.users table.
    """
    def post(self, request):
        user_id = request.data.get('supabase_user_id')
        if not user_id:
            return Response({'error': 'supabase_user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            return Response({'error': 'Supabase env vars not set'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        try:
            # Fetch user identities from auth.users
            user_auth = supabase.table('auth.users').select('id, identities').eq('id', user_id).single().execute()
            if not user_auth.data:
                return Response({'error': 'User not found in auth.users'}, status=status.HTTP_404_NOT_FOUND)
            identities = user_auth.data.get('identities', [])
            google_identity = next((i for i in identities if i.get('provider') == 'google'), None)
            if not google_identity:
                return Response({'error': 'No Google identity found'}, status=status.HTTP_404_NOT_FOUND)
            idata = google_identity.get('identity_data', {})
            access_token = idata.get('access_token')
            refresh_token = idata.get('refresh_token')
            expires_at = idata.get('expires_at')
            if not (access_token and refresh_token and expires_at):
                return Response({'error': 'Missing Google tokens'}, status=status.HTTP_400_BAD_REQUEST)
            # Update public.users
            update = supabase.table('users').update({
                'google_access_token': access_token,
                'google_refresh_token': refresh_token,
                'google_token_expiry': expires_at * 1000  # store as ms since epoch or convert as needed
            }).eq('id', user_id).execute()
            if getattr(update, 'error', None):
                return Response({'error': str(update.error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({'success': True})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

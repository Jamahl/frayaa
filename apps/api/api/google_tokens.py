import os
from supabase import create_client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

SUPABASE_URL = getattr(settings, 'SUPABASE_URL', None)
SUPABASE_SERVICE_ROLE_KEY = getattr(settings, 'SUPABASE_SERVICE_ROLE_KEY', None)


def get_google_tokens_for_user(user_id: str):
    """
    Secure backend utility to retrieve Google OAuth tokens for a given user_id.
    Only for internal backend use—never expose tokens to client or public API.
    Returns a dict with access_token, refresh_token, and expiry, or raises Exception on error.
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise Exception('Supabase env vars not set')
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    result = supabase.table('public.users').select(
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

from rest_framework.permissions import AllowAny

class StoreGoogleTokensView(APIView):
    """
    Receives a POST with supabase_user_id (uuid string).
    Fetches Google OAuth tokens from Supabase Auth user identities.
    Stores them in the public.users table.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        import logging
        logger = logging.getLogger("django.request")
        from django.conf import settings
        import os
        logger.info("/google-tokens/ POST called")
        logger.info(f"Request data: {request.data}")
        logger.info(f"DEBUG: SUPABASE_URL={os.getenv('SUPABASE_URL')} | settings.SUPABASE_URL={getattr(settings, 'SUPABASE_URL', None)}")
        logger.info(f"DEBUG: SUPABASE_SERVICE_ROLE_KEY={os.getenv('SUPABASE_SERVICE_ROLE_KEY')} | settings.SUPABASE_SERVICE_ROLE_KEY={getattr(settings, 'SUPABASE_SERVICE_ROLE_KEY', None)}")
        user_id = request.data.get('supabase_user_id')
        if not user_id:
            logger.error("Missing supabase_user_id in request data")
            return Response({'error': 'supabase_user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            logger.error("Supabase env vars not set: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing")
            return Response({'error': 'Supabase env vars not set'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        logger.info("Creating Supabase client with service role")
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        try:
            # Fetch user identities from auth.users using RPC function
            logger.info(f"Fetching user from auth.users with id: {user_id}")
            
            # Call the RPC function to get Google identity
            result = supabase.rpc('get_user_google_identity', {'user_uuid': user_id}).execute()
            logger.info(f"User auth fetch result (RPC): {result}")
            
            if result.data is None:
                logger.error(f"User not found in auth.users for id: {user_id}")
                return Response({'error': 'User not found in auth.users'}, status=status.HTTP_404_NOT_FOUND)
            
            google_identity = result.data
            if not google_identity:
                logger.error(f"No Google identity found for user: {user_id}")
                return Response({'error': 'No Google identity found'}, status=status.HTTP_404_NOT_FOUND)
            
            # The RPC function now returns identity_data directly
            access_token = google_identity.get('access_token')
            refresh_token = google_identity.get('refresh_token')
            expires_at = google_identity.get('expires_at')
            if not (access_token and refresh_token and expires_at):
                logger.error(f"Missing Google tokens for user: {user_id}, identity_data: {google_identity}")
                return Response({'error': 'Missing Google tokens'}, status=status.HTTP_400_BAD_REQUEST)
            # Update public.users
            logger.info(f"Updating users table for user: {user_id}")
            update = supabase.table('public.users').update({
                'google_access_token': access_token,
                'google_refresh_token': refresh_token,
                'google_token_expiry': expires_at * 1000  # store as ms since epoch or convert as needed
            }).eq('id', user_id).execute()
            if getattr(update, 'error', None):
                logger.error(f"Error updating users table: {update.error}")
                return Response({'error': str(update.error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            logger.info(f"Successfully updated Google tokens for user: {user_id}")
            return Response({'success': True})
        except Exception as e:
            logger.exception(f"Exception in /google-tokens/ for user: {user_id}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

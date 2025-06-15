from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
from supabase import create_client

SUPABASE_URL = getattr(settings, 'SUPABASE_URL', None)
SUPABASE_SERVICE_ROLE_KEY = getattr(settings, 'SUPABASE_SERVICE_ROLE_KEY', None)

class UserPreferencesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            return Response({'error': 'Supabase env vars not set'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        result = supabase.table('public.preferences').select(
            'preferred_days, preferred_times, buffer_minutes, custom_ea_prompt'
        ).eq('user_id', user_id).single().execute()
        if getattr(result, 'error', None):
            return Response({'error': str(result.error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if not result.data:
            return Response({'error': 'Preferences not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(result.data)

    def post(self, request, user_id):
        data = request.data
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            return Response({'error': 'Supabase env vars not set'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        # Try update first
        update = supabase.table('public.preferences').update({
            'preferred_days': data.get('preferred_days'),
            'preferred_times': data.get('preferred_times'),
            'buffer_minutes': data.get('buffer_minutes'),
            'custom_ea_prompt': data.get('custom_ea_prompt'),
        }).eq('user_id', user_id).execute()
        if getattr(update, 'error', None):
            return Response({'error': str(update.error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # If no rows updated, insert instead
        if not update.data or (isinstance(update.data, list) and len(update.data) == 0):
            insert = supabase.table('public.preferences').insert({
                'user_id': user_id,
                'preferred_days': data.get('preferred_days'),
                'preferred_times': data.get('preferred_times'),
                'buffer_minutes': data.get('buffer_minutes'),
                'custom_ea_prompt': data.get('custom_ea_prompt'),
            }).execute()
            if getattr(insert, 'error', None):
                return Response({'error': str(insert.error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'success': True})

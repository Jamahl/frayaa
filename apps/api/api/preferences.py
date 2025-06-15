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
        import logging
        logger = logging.getLogger("django.request")
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            return Response({'error': 'Supabase env vars not set'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        
        try:
            # Use .execute() instead of .single() to avoid exceptions on missing rows
            result = supabase.table('preferences').select(
                'preferred_days, preferred_times, buffer_minutes, custom_ea_prompt'
            ).eq('user_id', user_id).execute()
            
            # Check if any data was returned
            if not result.data or len(result.data) == 0:
                # No preferences found, return defaults
                logger.info(f"No preferences found for user {user_id}, returning defaults")
                return Response({
                    'preferred_days': [],
                    'preferred_times': '',
                    'buffer_minutes': 15,
                    'custom_ea_prompt': ''
                }, status=status.HTTP_200_OK)
            
            # Return the first (and should be only) row
            return Response(result.data[0], status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception(f"Error fetching preferences for user {user_id}: {e}")
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, user_id):
        data = request.data
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            return Response({'error': 'Supabase env vars not set'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        # Try update first
        update = supabase.table('preferences').update({
            'preferred_days': data.get('preferred_days'),
            'preferred_times': data.get('preferred_times'),
            'buffer_minutes': data.get('buffer_minutes'),
            'custom_ea_prompt': data.get('custom_ea_prompt'),
        }).eq('user_id', user_id).execute()
        if getattr(update, 'error', None):
            return Response({'error': str(update.error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # If no rows updated, insert instead
        if not update.data or (isinstance(update.data, list) and len(update.data) == 0):
            insert = supabase.table('preferences').insert({
                'user_id': user_id,
                'preferred_days': data.get('preferred_days'),
                'preferred_times': data.get('preferred_times'),
                'buffer_minutes': data.get('buffer_minutes'),
                'custom_ea_prompt': data.get('custom_ea_prompt'),
            }).execute()
            if getattr(insert, 'error', None):
                return Response({'error': str(insert.error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'success': True})

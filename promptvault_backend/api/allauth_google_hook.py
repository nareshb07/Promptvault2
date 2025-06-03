from allauth.socialaccount.models import SocialToken
from django.dispatch import receiver
from allauth.socialaccount.signals import social_account_added

@receiver(social_account_added)
def capture_social_token(request, sociallogin, **kwargs):
    account = sociallogin.account
    if account.provider == 'google':
        try:
            token = SocialToken.objects.get(account=account)
            print("Token captured:", token.token)
        except SocialToken.DoesNotExist:
            print("Token not found after login.")
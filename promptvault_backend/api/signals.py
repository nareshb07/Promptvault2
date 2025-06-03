# accounts/signals.py
from allauth.account.signals import user_signed_up
from django.dispatch import receiver

@receiver(user_signed_up)
def set_username_from_email(request, user, **kwargs):
    if not user.username and user.email:
        user.username = user.email.split('@')[0]
        user.save()


from django.dispatch import receiver
from allauth.socialaccount.signals import pre_social_login
from allauth.socialaccount.models import SocialToken

@receiver(pre_social_login)
def handle_google_token(sender, request, sociallogin, **kwargs):
    print("📥 Google Login Detected")
    print("User:", sociallogin.user)
    print("Provider:", sociallogin.account.provider)

    # Check if token already exists
    try:
        token = SocialToken.objects.get(account=sociallogin.account)
        print("✅ Token already exists:", token.token)
    except SocialToken.DoesNotExist:
        print("❌ No token exists for this login yet")


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
def capture_google_token(sender, request, sociallogin, **kwargs):
    print("📥 Google Login Detected")
    account = sociallogin.account
    if account.provider == 'google':
        try:
            token = SocialToken.objects.get(account=account)
            print("✅ Token already exists:", token.token)
        except SocialToken.DoesNotExist:
            print("❌ No token exists — attempting manual save...")
            try:
                # Try to save the token manually
                app = account.app  # This should be set
                token = SocialToken.objects.create(
                    app=app,
                    account=account,
                    token=sociallogin.token.token,
                    token_secret=sociallogin.token.token_secret or ""
                )
                print("✅ Forced saved Google token:", token.token)
            except Exception as e:
                print("🚨 Failed to force save token:", str(e))

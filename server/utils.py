from email_validator import validate_email


def normalize_email(email, check_deliverability=False):
    v = validate_email(
        email, check_deliverability=check_deliverability
    )
    normalized_email = v['email']
    if v['domain_i18n'] == 'googlemail.com':
        normalized_email = v['local'] + '@gmail.com'

    return normalized_email

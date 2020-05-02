from more.cerberus import CerberusValidator
from email_validator import EmailSyntaxError, EmailUndeliverableError


class EmailValidator(CerberusValidator):
    def _check_with_verify_email(self, field, value):
        email_validation_service = self.request.app.service(
            name='email_validation'
        )
        try:
            email_validation_service.verify(value)

        except EmailSyntaxError:
            self._error(field, 'Not valid email')

        except EmailUndeliverableError:
            self._error(field, 'Email could not be delivered')

    def _normalize_coerce_normalize_email(self, value):
        email_validation_service = self.request.app.service(
            name='email_validation'
        )
        return email_validation_service.normalize(value)

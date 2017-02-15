from functools import partial
from cerberus import Validator as Cerberus
from email_validator import EmailSyntaxError, EmailUndeliverableError
from .error import Error


class Validator(Cerberus):
    def __init__(self, request, *args, **kwargs):
        self.request = request
        self.email_validation_service = self.request.app.service(
            name='email_validation'
        )
        super(Validator, self).__init__(*args, **kwargs)

    def _validator_validate_email(self, field, value):
        try:
            self.email_validation_service.validate(value)

        except EmailSyntaxError:
            self._error(field, 'Not valid email')

    def _validator_verify_email(self, field, value):
        try:
            self.email_validation_service.verify(value)

        except EmailSyntaxError:
            self._error(field, 'Not valid email')

        except EmailUndeliverableError:
            self._error(field, 'Email could not be delivered')

    def _normalize_coerce_normalize_email(self, value):
        return self.email_validation_service.normalize(value)


def load(schema, update, request):
    v = Validator(request, schema)

    if v.validate(request.json, update=update):
        return v.document
    else:
        raise Error(v.errors)


def loader(schema, update=False):
    """Create a load function based on schema dict and request.

    :param schema: a Cerberus schema dict.
    :param update: If ``True``, required fields won't be checked.
    :type update: :class:`bool`

    You can plug this ``load`` function into a json view.

    Returns a ``load`` function that takes a request JSON body
    and uses the schema to validate it. This function raises
    :class:`more.cerberus.ValidationError` if it cannot do
    the validation.
    """
    return partial(load, schema, update)

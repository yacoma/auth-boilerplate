import pytest


@pytest.fixture(scope="session")
def smtp_server():
    from pytest_localserver import smtp

    port = 3377
    server = smtp.Server(port=port)
    server.start()
    yield server
    server.stop()


@pytest.fixture(scope="function")
def smtp(smtp_server):
    yield smtp_server
    del smtp_server.outbox[:]

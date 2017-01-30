import smtpd
import asyncore
from threading import Thread
from queue import Queue
from shutil import copy2

import pytest


@pytest.fixture(scope='module')
def smtp_server():
    """
    Adopted from https://gist.github.com/devsli/acce0c8508327ae57340.
    Return dummy SMTP server to check outgoing messages.
    The ``queque.Queue`` of ``tuple`` objects is yelded
    Sent queue example usage::
        def test_get_msg(SmtpServer):
            addr, sender, recipients, body = SmtpServer.get()
    Note that execution will be freezed until something is retrieved
    from ``sent`` queue. You can use ``Queue.get_nowait()`` or
    ``timeout`` parameter to avoid such behavior.
    Read more about
    `queues <https://docs.python.org/3/library/queue.html>`_
    """
    sent = Queue()
    port = 1125
    host = '0.0.0.0'

    class _TestSmtpServer(smtpd.SMTPServer):
        def __init__(self, sent_queue, *args, **kwargs):
            smtpd.SMTPServer.__init__(self, *args, **kwargs)
            self.sent_queue = sent_queue

        def process_message(self, *args):
            self.sent_queue.put(args)

    class _SmtpServerThread(Thread):
        def __init__(self, host, port, sent_queue):
            Thread.__init__(self)
            self.smtpd = _TestSmtpServer(sent_queue, (host, port), None)

        def run(self):
            asyncore.loop()

        def stop(self):
            self.smtpd.close()
            self.join()

    copy2('deploy/settings_test.json', 'settings.json')
    s = _SmtpServerThread(host, port, sent)
    s.start()
    yield sent
    s.stop()
    copy2('deploy/settings_local.json', 'settings.json')

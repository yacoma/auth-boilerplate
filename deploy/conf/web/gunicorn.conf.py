import multiprocessing

bind = "unix:/tmp/proxy_auth-boilerplate.yacoma.it.sock"
workers = multiprocessing.cpu_count() * 2 + 1
forwarded_allow_ips = "127.0.0.1, 188.165.237.135"

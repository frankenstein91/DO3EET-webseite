+++
title = 'Firefox Listening on UDP'
date = 2024-05-04T18:25:59+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Security",
    "Internet",
    "Networking",
]
+++

Today I took a look at [osquery](https://osquery.io/), since I wanted to feature it in a tool showcase here on the blog. I was especially interested in what it could do on the networking side. My first goal was to find a replacement for `netstat -tulpen`, so I put together the following SQL query...
<!--more-->
```sql
SELECT
  p.path,
  (CASE protocol
    WHEN 6 THEN 'TCP'
    WHEN 17 THEN 'UDP'
    ELSE protocol
  END) AS protocol,
  (CASE family
    WHEN 2 THEN 'IP4'
    WHEN 10 THEN 'IP6'
    ELSE family
  END) AS family,
  address,
  port
FROM listening_ports AS lpor
INNER JOIN processes AS p ON p.pid = lpor.pid
WHERE port != 0;

```

I know `netstat -tulpen` and `ss -tulpn` are way shorter. However, `netstat` is **deprecated** / **obsolete**.[^3] As for `ss`, in Germany's Nazi-era past that abbreviation carries a dark association with the *Schutzstaffel*. Git switched its default branch name from `master` to `main` because people recognized that the old term could be offensive to some.[^1] Saying the command `ss` out loud in an office (at least here in Germany)[^2] can earn you some pretty awkward looks—which is why I happily reach for alternatives to that command.

While testing my query, I noticed something really interesting... my Firefox is listening on 2 UDP ports, even when no website or tab is open yet.

| path                     | protocol | family | address   | port  |
|--------------------------|:--------:|:------:|----------:|:-----:|
| /usr/lib/firefox/firefox | UDP      | IP4    | 0.0.0.0   | 55367 |
| /usr/lib/firefox/firefox | UDP      | IP4    | 0.0.0.0   | 55367 |

The ports aren't fixed—this is just a snapshot from that exact moment. They disappear as soon as you set `network.http.http3.enable` to `false` in `about:config`, thereby **disabling** HTTP/3. So I'm guessing these are QUIC (Quick UDP Internet Connections) sockets used by HTTP/3.

[^1]: https://sfconservancy.org/news/2020/jun/23/gitbranchname/
[^2]: https://www.meinauto.de/lp/ratgeber/verbotene-kennzeichen
[^3]: https://lists.debian.org/debian-devel/2009/03/msg00780.html

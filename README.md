This is a 0-dependency implementation of the streaming mechanism described
[here](https://hpbn.co/xmlhttprequest/#streaming-data-with-xhr) and
shown [here](https://gist.github.com/igrigorik/5736866).

Please read those for caveats. Essentially streaming is text-only and the entire request ends up
in memory before being released, so don't try to stream anything too big.

#!/usr/bin/env python3

import csv
import json
import time
import hashlib

if __name__ == "__main__":
    fn ='plain_br.json'
    with open(fn) as f:
        data = json.load(f)


    routes = []
    hashes = set()
    for c in data:
        for s in c['sectors']:
            for r in s['routes']:
                h = hashlib.sha256(json.dumps(r, sort_keys=True).encode('utf8')).hexdigest()
                while h in hashes:
                    h = hashlib.sha256(str(time.time()).encode('utf8')).hexdigest()
                hashes.add(h)
                r['route_id'] = h
                routes.append(r)

    with open('linked.json', 'w') as f:
        f.write(json.dumps(data))

    with open('linked_routes.json', 'w') as f:
        f.write(json.dumps(routes))

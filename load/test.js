import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failures = new Rate('request_failures');
const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:80';


// Safety guard: this load-test script is intentionally restricted to loopback.
const allowedHosts = ['http://127.0.0.1', 'http://localhost', '::1', 'http://web'];
if (!allowedHosts.some(host =>
    BASE_URL === host || BASE_URL.startsWith(host + ':')
)) {
    throw new Error('Loadtests zijn alleen toegestaan op localhost.');
}

console.log(`USING ${BASE_URL} `);

export const options = {
    stages: [
        { duration: '15s', target: 2 },
        { duration: '30s', target: 5 },
        { duration: '15s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'],
        http_req_duration: ['p(95)<1500'],
        request_failures: ['rate<0.05'],
    },
};

export default function () {
    const pages = [
        { name: 'home', path: '/' },
        { name: 'search', path: '/search.php?q=load-test' },
        { name: 'contact', path: '/contact.php' },
        { name: 'login', path: '/login.php' },
    ];

    for (const page of pages) {
        const response = http.get(`${BASE_URL}${page.path}`, {
            tags: { page: page.name },
        });
        const ok = check(response, {
            [`${page.name}: HTTP 200`]: (r) => r.status === 200,
            [`${page.name}: HTML response`]: (r) => (r.headers['Content-Type'] || '').includes('text/html'),
        });
        failures.add(!ok);
    }

    sleep(1);
}

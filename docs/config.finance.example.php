<?php

return [
    // Upstream Truncgil API URL (or other source)
    'api_url' => 'https://api.truncgil.com/finance',

    // Cache key and duration (seconds)
    'cache_key' => 'finance_data',
    'cache_duration' => 3600,

    // HTTP timeout in seconds
    'timeout' => 5,

    // Throw exceptions instead of returning empty arrays
    'throw_exceptions' => false,
];

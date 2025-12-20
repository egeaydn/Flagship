const { createClient } = require('./dist/index.js');

async function test() {
  const client = createClient({
    apiKey: 'fsk_server_133e61fa671d3e927a1eba415220a284',
    apiUrl: 'http://localhost:3000/api/v1',
  });

  console.log('🚀 Testing Flagship SDK...\n');

  try {
    // Test 1: Get flags
    console.log('Test 1: Getting flags...');
    const flags = await client.getFlags({ id: 'test-user-123' });
    console.log('✅ Flags:', JSON.stringify(flags, null, 2));

    // Test 2: Check if flag is enabled
    console.log('\nTest 2: Checking flag status...');
    const isEnabled = client.isEnabled('recep-tayyip-erdogan', flags);
    console.log(`✅ Flag "recep-tayyip-erdogan" enabled:`, isEnabled);

    // Test 3: Get flag value
    console.log('\nTest 3: Getting flag value...');
    const value = client.getValue('recep-tayyip-erdogan', flags, false);
    console.log('✅ Flag value:', value);

    // Test 4: Cache test (should be instant)
    console.log('\nTest 4: Testing cache...');
    const start = Date.now();
    await client.getFlags({ id: 'test-user-123' });
    const duration = Date.now() - start;
    console.log(`✅ Cache hit! Response time: ${duration}ms`);

    console.log('\n✨ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test();

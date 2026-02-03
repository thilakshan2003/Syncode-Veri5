
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const PORT = process.env.PORT || 5000;
const client = wrapper(axios.create({ jar, baseURL: `http://localhost:${PORT}/api/auth` }));

async function testAuth() {
    console.log('🧪 Starting Authentication Tests...');

    const testUser = {
        username: 'test_user_' + Math.floor(Math.random() * 10000),
        email: 'test' + Math.floor(Math.random() * 10000) + '@example.com',
        password: 'password123',
        gender: 'Other',
    };

    try {
        // 1. Signup
        console.log('\n1️⃣ Testing Signup...');
        const signupRes = await client.post('/signup', testUser);
        console.log('✅ Signup Status:', signupRes.status);
        console.log('   Response:', signupRes.data);

        if (signupRes.status !== 201) throw new Error('Signup failed');

        // 2. Check Me (should be logged in after signup)
        console.log('\n2️⃣ Testing Me (Auto-login)...');
        const meRes1 = await client.get('/me');
        console.log('✅ Me Status:', meRes1.status);
        console.log('   User ID:', meRes1.data.user.id);

        if (meRes1.status !== 200) throw new Error('Auto-login check failed');

        // 3. Logout
        console.log('\n3️⃣ Testing Logout...');
        const logoutRes = await client.post('/logout');
        console.log('✅ Logout Status:', logoutRes.status);

        // 4. Check Me (should fail)
        console.log('\n4️⃣ Testing Me (After Logout)...');
        try {
            await client.get('/me');
            console.error('❌ Me should have failed!');
        } catch (err: any) {
            console.log('✅ Me correctly failed with:', err.response?.status);
        }

        // 5. Login
        console.log('\n5️⃣ Testing Login...');
        const loginRes = await client.post('/login', {
            email: testUser.email,
            password: testUser.password,
        });
        console.log('✅ Login Status:', loginRes.status);

        if (loginRes.status !== 200) throw new Error('Login failed');

        // 6. Check Me (should be logged in again)
        console.log('\n6️⃣ Testing Me (After Login)...');
        const meRes2 = await client.get('/me');
        console.log('✅ Me Status:', meRes2.status);
        console.log('   User ID:', meRes2.data.user.id);

        if (meRes2.status !== 200) throw new Error('Login check failed');

        console.log('\n🎉 All authentication tests passed!');

    } catch (error: any) {
        console.error('\n❌ Test Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testAuth();

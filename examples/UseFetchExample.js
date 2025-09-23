import React, { useState } from 'react';
import useFetch, { useGet, usePost, usePut, useDelete } from '../hooks/useFetch';

const UseFetchExample = () => {
    const [userId, setUserId] = useState(1);
    const [newUser, setNewUser] = useState({ name: '', email: '' });

    // Example 1: Basic GET request with immediate execution
    const {
        data: users,
        loading: usersLoading,
        error: usersError,
        refetch: refetchUsers
    } = useGet('https://jsonplaceholder.typicode.com/users', {
        cache: true,
        cacheTime: 5 * 60 * 1000, // 5 minutes
        onSuccess: (data) => {
            console.log('Users loaded successfully:', data.length);
        },
        onError: (error) => {
            console.error('Failed to load users:', error);
        }
    });

    // Example 2: GET request with dynamic URL (not immediate)
    const {
        data: user,
        loading: userLoading,
        error: userError,
        execute: fetchUser
    } = useGet(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        immediate: false,
        transform: (data) => ({
            ...data,
            fullName: data.name,
            displayEmail: data.email.toLowerCase()
        })
    });

    // Example 3: POST request for creating new user
    const {
        data: createdUser,
        loading: createLoading,
        error: createError,
        execute: createUser
    } = usePost('https://jsonplaceholder.typicode.com/users', {
        onSuccess: (data) => {
            console.log('User created:', data);
            setNewUser({ name: '', email: '' });
            refetchUsers(); // Refresh users list
        }
    });

    // Example 4: PUT request for updating user
    const {
        loading: updateLoading,
        error: updateError,
        execute: updateUser
    } = usePut(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        onSuccess: () => {
            console.log('User updated successfully');
            fetchUser(); // Refresh user data
        }
    });

    // Example 5: DELETE request
    const {
        loading: deleteLoading,
        error: deleteError,
        execute: deleteUser
    } = useDelete(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        onSuccess: () => {
            console.log('User deleted successfully');
            refetchUsers(); // Refresh users list
        }
    });

    // Example 6: Manual fetch with custom options
    const {
        data: posts,
        loading: postsLoading,
        error: postsError,
        execute: fetchPosts
    } = useFetch('https://jsonplaceholder.typicode.com/posts', {
        immediate: false,
        retry: 3,
        retryDelay: 2000,
        timeout: 15000,
        cache: true
    });

    const handleFetchUser = () => {
        fetchUser();
    };

    const handleCreateUser = () => {
        if (!newUser.name || !newUser.email) {
            alert('Please fill in all fields');
            return;
        }

        createUser(null, {
            body: JSON.stringify(newUser)
        });
    };

    const handleUpdateUser = () => {
        updateUser(null, {
            body: JSON.stringify({
                name: 'Updated Name',
                email: 'updated@example.com'
            })
        });
    };

    const handleDeleteUser = () => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser();
        }
    };

    const handleFetchPosts = () => {
        fetchPosts();
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>useFetch Hook Examples</h1>

            {/* Example 1: Users List */}
            <section style={{ marginBottom: '30px' }}>
                <h2>1. Users List (GET with cache)</h2>
                {usersLoading && <p>Loading users...</p>}
                {usersError && <p style={{ color: 'red' }}>Error: {usersError.message}</p>}
                {users && (
                    <div>
                        <p>Found {users.length} users</p>
                        <button onClick={refetchUsers} disabled={usersLoading}>
                            Refresh Users
                        </button>
                        <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {users.slice(0, 5).map(user => (
                                <li key={user.id}>
                                    {user.name} - {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* Example 2: Single User */}
            <section style={{ marginBottom: '30px' }}>
                <h2>2. Single User (GET with transform)</h2>
                <div>
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        min="1"
                        max="10"
                        style={{ marginRight: '10px' }}
                    />
                    <button onClick={handleFetchUser} disabled={userLoading}>
                        {userLoading ? 'Loading...' : 'Fetch User'}
                    </button>
                </div>
                {userError && <p style={{ color: 'red' }}>Error: {userError.message}</p>}
                {user && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5' }}>
                        <p><strong>Name:</strong> {user.fullName}</p>
                        <p><strong>Email:</strong> {user.displayEmail}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                    </div>
                )}
            </section>

            {/* Example 3: Create User */}
            <section style={{ marginBottom: '30px' }}>
                <h2>3. Create User (POST)</h2>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button onClick={handleCreateUser} disabled={createLoading}>
                        {createLoading ? 'Creating...' : 'Create User'}
                    </button>
                </div>
                {createError && <p style={{ color: 'red' }}>Error: {createError.message}</p>}
                {createdUser && (
                    <p style={{ color: 'green' }}>
                        User created with ID: {createdUser.id}
                    </p>
                )}
            </section>

            {/* Example 4: Update User */}
            <section style={{ marginBottom: '30px' }}>
                <h2>4. Update User (PUT)</h2>
                <button onClick={handleUpdateUser} disabled={updateLoading}>
                    {updateLoading ? 'Updating...' : `Update User ${userId}`}
                </button>
                {updateError && <p style={{ color: 'red' }}>Error: {updateError.message}</p>}
            </section>

            {/* Example 5: Delete User */}
            <section style={{ marginBottom: '30px' }}>
                <h2>5. Delete User (DELETE)</h2>
                <button 
                    onClick={handleDeleteUser} 
                    disabled={deleteLoading}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px' }}
                >
                    {deleteLoading ? 'Deleting...' : `Delete User ${userId}`}
                </button>
                {deleteError && <p style={{ color: 'red' }}>Error: {deleteError.message}</p>}
            </section>

            {/* Example 6: Posts with retry */}
            <section style={{ marginBottom: '30px' }}>
                <h2>6. Posts (with retry and timeout)</h2>
                <button onClick={handleFetchPosts} disabled={postsLoading}>
                    {postsLoading ? 'Loading...' : 'Fetch Posts'}
                </button>
                {postsError && <p style={{ color: 'red' }}>Error: {postsError.message}</p>}
                {posts && (
                    <div>
                        <p>Found {posts.length} posts</p>
                        <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {posts.slice(0, 5).map(post => (
                                <li key={post.id}>
                                    <strong>{post.title}</strong>
                                    <br />
                                    <small>{post.body.substring(0, 100)}...</small>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* Usage Instructions */}
            <section style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h2>Usage Instructions</h2>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <h3>Basic Usage:</h3>
                    <pre style={{ background: '#e9ecef', padding: '10px', borderRadius: '4px' }}>
{`const { data, loading, error, execute, refetch } = useFetch(url, options);`}
                    </pre>

                    <h3>Available Options:</h3>
                    <ul>
                        <li><code>method</code>: HTTP method (GET, POST, PUT, DELETE)</li>
                        <li><code>headers</code>: Custom headers object</li>
                        <li><code>body</code>: Request body (for POST/PUT)</li>
                        <li><code>immediate</code>: Execute immediately on mount (default: true)</li>
                        <li><code>cache</code>: Enable response caching (default: false)</li>
                        <li><code>cacheTime</code>: Cache duration in milliseconds</li>
                        <li><code>retry</code>: Number of retry attempts (default: 0)</li>
                        <li><code>retryDelay</code>: Delay between retries in ms</li>
                        <li><code>timeout</code>: Request timeout in ms (default: 10000)</li>
                        <li><code>transform</code>: Function to transform response data</li>
                        <li><code>onSuccess</code>: Success callback function</li>
                        <li><code>onError</code>: Error callback function</li>
                    </ul>

                    <h3>Convenience Hooks:</h3>
                    <ul>
                        <li><code>useGet(url, options)</code> - GET requests</li>
                        <li><code>usePost(url, options)</code> - POST requests (immediate: false)</li>
                        <li><code>usePut(url, options)</code> - PUT requests (immediate: false)</li>
                        <li><code>useDelete(url, options)</code> - DELETE requests (immediate: false)</li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default UseFetchExample;

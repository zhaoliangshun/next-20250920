/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          // 配置 api.dicebear.com 示例
          {
            protocol: 'https', // 协议（http 或 https）
            hostname: 's3.amazonaws.com', // 域名（必填）
            port: '', // 端口（空字符串表示默认端口）
            pathname: '/**', // 路径匹配模式（** 表示所有路径）
          },
          
          // 可以添加多个配置项
          {
            protocol: 'https', // 协议（http 或 https）
            hostname: 'api.dicebear.com', // 域名（必填）
            port: '', // 端口（空字符串表示默认端口）
            pathname: '/**', // 路径匹配模式（** 表示所有路径）
          },
          // 可以添加多个配置项
          {
            protocol: 'https', // 协议（http 或 https）
            hostname: 'randomuser.me', // 域名（必填）
            port: '', // 端口（空字符串表示默认端口）
            pathname: '/**', // 路径匹配模式（** 表示所有路径）
          },
        ],
    },
};

export default nextConfig;

# Overview

This project includes three modules:

```sh
├── src
│   ├── auth # Auth module
│   ├── config # Configuration
│   ├── helpers # Helper functions
│   ├── migrations # Database migrations
│   ├── shared # Shared
│   ├── task # Tasks module
│   ├── user # User module
│   ├── app.module.ts # The root module of the application
│   ├── main.ts # The entry file of the application
│   ├── mikro-orm.config.ts # The configuration file for MikroORM
```
- Hãy mô tả cách bạn sẽ mở rộng và tối ưu hoá hiệu suất cho ứng dụng của mình trong tương lai.
  + Có thể apply caching cho 1 số API nhất định để tăng tốc độ truy cập dữ liệu.
  + Tối uư hoá database query bằng cách sử dụng index, partitioning, or materialized views.
  + Sourcecode hiện tại là monolithic, nhưng đang chia nhỏ nhiều module. Nếu cần thiết có thể tách từng module thành 1 service riêng biệt.

- Làm thế nào để bạn đảm bảo rằng ứng dụng của bạn là an toàn và bảo mật thông tin người dùng?
  + Dùng JWT để xác thực người dùng. Sử dụng Role-Based Access Control (RBAC) để quản lý quyền truy cập của người dùng.
  + Apply rate limiting cho 1 số API nhất định để tránh tình trạng bị tấn công DDoS.
  + Validate dữ liệu đầu vào từ người dùng để tránh tình trạng bị tấn công SQL Injection hoặc XSS.

- Giải thích cách bạn sẽ triển khai ứng dụng của mình lên một máy chủ.
  + Có thể sử dụng pm2 để chạy ứng dụng Node.js trên máy chủ. Ngoài ra, có thể sử dụng Docker để containerize ứng dụng.
  + Sử dụng Nginx để reverse proxy cho ứng dụng.
  + Sử dụng CI/CD để tự động hóa quá trình deploy ứng dụng lên máy chủ.

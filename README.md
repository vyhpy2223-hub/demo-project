# English Speaking AI Platform – Database Design

## 1. Giới thiệu
Dự án **English Speaking AI** là nền tảng hỗ trợ luyện nói tiếng Anh với AI, 
cung cấp các chức năng cá nhân hóa học tập, đánh giá phát âm, 
theo dõi tiến độ và quản lý gói học.

Repository này chứa **toàn bộ thiết kế Database (MSSQL)** phục vụ cho hệ thống.

---

## 2. Công nghệ sử dụng
- Database: **Microsoft SQL Server**
- Công cụ: VS Code + Database Client
- Ngôn ngữ: SQL

---

## 3. Cấu trúc thư mục

```text
database/
├─ schema/
│  ├─ 01_create_tables.sql
│  ├─ 02_create_tables.sql
│
├─ functions/
│  └─ fn_get_level.sql
│
├─ triggers/
│  └─ trg_deactivate_user.sql

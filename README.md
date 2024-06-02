# inventory_system
Inventory organizer with React / next.js frontend utilizing Radix UI components and a Flask backend, combined with a SQLite database
- Admin Login with all rights: User: admin@admin.com / PW: admin
- User Login with some rights: User: user@user.com / PW: user (allows only to create / change orders, not suppliers or products)

- System allows to create, alter, filter, flag or delete:
  - Suppliers
  - Products in stock with amount X related to one supplier
  - Orders of products in stock (related to products and their suppliers)
- System also features a dashboard showing recent orders, low in stock / out of stock items and system statistics (total number of suppliers etc.)
- if an order is canceled, the items get restocked
- Orders can be flagged as Active, Done, Archived or Canceled
- Orders allow to order mutiple items (max. amount per item == amount of item in stock)
- Suppliers and Products can be filtered by name

- "User", in comparison to "Admin" can not change, create or delete suppliers or products
- "User" can only create or alter orders
- secured via conditional rendering in React and Flask Login permissions in the backend

## Log In Menu (Allows for Admin login or User Login)
![Screenshot from 2024-06-02 15-17-40](https://github.com/tim91136/inventory_system/assets/119872909/2f7b68e2-f28d-4ee5-9e64-fb0013e2b5c7)

## After Successful Login, the main Dashboard appears
![Screenshot from 2024-06-02 15-19-31](https://github.com/tim91136/inventory_system/assets/119872909/f042c3a1-5b48-4eaa-ace3-7bf9e4ad4e49)

## Scrolling down the dashboard
![Screenshot from 2024-06-02 15-19-37](https://github.com/tim91136/inventory_system/assets/119872909/9c57c4fe-f800-4705-8da3-7f207961b3f8)

## Products Management viewed as Admin
![Screenshot from 2024-06-02 15-19-51](https://github.com/tim91136/inventory_system/assets/119872909/20826e2b-be40-476e-b2ae-06a9564e1029)

## Products Management viewed as User (see top right corner for user info), no rights to alter the products)
![Screenshot from 2024-06-02 15-21-06](https://github.com/tim91136/inventory_system/assets/119872909/9743ec44-506e-4086-95a9-a44d6c51a353)

## Orders Management viewed as Admin / User (same rights here)
![Screenshot from 2024-06-02 15-19-17](https://github.com/tim91136/inventory_system/assets/119872909/4642f75a-0f5d-484f-a811-94d2454df656)

## Creating a new order
![Screenshot from 2024-06-02 15-18-58](https://github.com/tim91136/inventory_system/assets/119872909/8195b686-c348-4d3b-a903-ab0c10f6b46e)

## Suppliers Management viewed as Admin
![Screenshot from 2024-06-02 15-20-05](https://github.com/tim91136/inventory_system/assets/119872909/68d7ce90-b0d3-4d0e-a865-1b9936cc1964)

## Different Toasts built in as dynamic feedback
![image](https://github.com/tim91136/inventory_system/assets/119872909/8c366297-6a17-4da1-bbef-fe1d3c68e287)


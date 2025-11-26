-- Bật chế độ ràng buộc khóa ngoại
PRAGMA foreign_keys = ON;

-- -- Bảng 1: Employees
-- CREATE TABLE IF NOT EXISTS Employees (
--     EmployeeID INTEGER PRIMARY KEY AUTOINCREMENT,
--     Name TEXT,
--     Birthdate DATE,
--     Status TEXT
-- );

-- -- Bảng 2: Account_Employees
-- CREATE TABLE IF NOT EXISTS Account_Employees (
--     AccountID INTEGER PRIMARY KEY AUTOINCREMENT,
--     EmployeeID INTEGER,
--     Username TEXT UNIQUE,
--     Password TEXT,
--     CreateDate DATETIME,
--     FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
-- );



-- Bảng 4: Customers
CREATE TABLE IF NOT EXISTS Customers (
    CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Email TEXT UNIQUE, 
    Birthday DATETIME, 
    Sex TEXT
);

-- Bảng 5: Account_Customers
CREATE TABLE IF NOT EXISTS Account_Customers (
    AccountID INTEGER PRIMARY KEY AUTOINCREMENT,
    CustomerID INTEGER,
    Username TEXT UNIQUE,
    Password TEXT,
    CreateDate DATETIME,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- -- Bảng 6: List_Customer
-- CREATE TABLE List_Customer (
--     ListCustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
--     CustomerID INTEGER,
--     Name TEXT,
--     Description TEXT,
--     CreateDate DATETIME,
--     EndDate DATETIME,
--     FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
-- );

-- -- Bảng 7: ListDetails
-- CREATE TABLE ListDetails (
--     ListDetailID INTEGER PRIMARY KEY AUTOINCREMENT,
--     ListCustomerID INTEGER,
--     AddCode TEXT,
--     FOREIGN KEY (ListCustomerID) REFERENCES List_Customer(ListCustomerID)
-- );

-- -- Bảng 8: Categories
-- CREATE TABLE Categories (
--     CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
--     Name TEXT,
--     Description TEXT
-- );

-- -- Bảng 9: Products
-- CREATE TABLE Products (
--     ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
--     CategoryID INTEGER,
--     Name TEXT,
--     Size TEXT,
--     User TEXT,
--     Price REAL,
--     InternalStock INTEGER,
--     StockQuantity INTEGER,
--     Description TEXT,
--     FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
-- );

-- -- Bảng 10: Feedbacks
-- CREATE TABLE Feedbacks (
--     FeedbackID INTEGER PRIMARY KEY AUTOINCREMENT,
--     ProductID INTEGER,
--     CustomerID INTEGER,
--     Comment TEXT,
--     Rating INTEGER,
--     FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
--     FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
-- );

-- -- Bảng 11: Carts
-- CREATE TABLE Carts (
--     CartID INTEGER PRIMARY KEY AUTOINCREMENT,
--     CustomerID INTEGER,
--     CreateDate DATETIME,
--     FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
-- );

-- -- Bảng 12: CartDetails
-- CREATE TABLE CartDetails (
--     CartDetailID INTEGER PRIMARY KEY AUTOINCREMENT,
--     CartID INTEGER,
--     ProductID INTEGER,
--     Quantity INTEGER,
--     FOREIGN KEY (CartID) REFERENCES Carts(CartID),
--     FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
-- );

-- -- Bảng 13: Addresses
-- CREATE TABLE Addresses (
--     AddressID INTEGER PRIMARY KEY AUTOINCREMENT,
--     CustomerID INTEGER,
--     City TEXT,
--     State TEXT,
--     District TEXT,
--     Commune TEXT,
--     DetailAddress TEXT,
--     Status TEXT,
--     FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
-- );

-- -- Bảng 14: Shippers
-- CREATE TABLE Shippers (
--     ShipperID INTEGER PRIMARY KEY AUTOINCREMENT,
--     AddressID INTEGER,
--     CompanyName TEXT,
--     Method TEXT,
--     Phone TEXT,
--     Email TEXT,
--     Status TEXT,
--     FOREIGN KEY (AddressID) REFERENCES Addresses(AddressID)
-- );

-- -- Bảng 15: Orders
-- CREATE TABLE Orders (
--     OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
--     CustomerID INTEGER,
--     EmployeeID INTEGER,
--     ShipperID INTEGER,
--     ShippedDate DATETIME,
--     RequiredDate DATETIME,
--     Status TEXT,
--     FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
--     FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
--     FOREIGN KEY (ShipperID) REFERENCES Shippers(ShipperID)
-- );

-- -- Bảng 16: OrderDetails (Sử dụng Primary Key phức hợp không cần AUTOINCREMENT)
-- CREATE TABLE OrderDetails (
--     OrderDetailID INTEGER PRIMARY KEY AUTOINCREMENT,
--     OrderID INTEGER,
--     ProductID INTEGER,
--     TotalPrice REAL,
--     Quantity INTEGER,
--     TotalAmount REAL,
--     FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
--     FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
-- );

-- -- Bảng 17: Invoices
-- CREATE TABLE Invoices (
--     InvoiceID INTEGER PRIMARY KEY AUTOINCREMENT,
--     OrderID INTEGER,
--     TotalAmount REAL,
--     ShipmentFee REAL,
--     Tax REAL,
--     Status TEXT,
--     FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
-- );

-- -- Bảng 18: Payments
-- CREATE TABLE Payments (
--     PaymentID INTEGER PRIMARY KEY AUTOINCREMENT,
--     InvoiceID INTEGER,
--     Method TEXT,
--     ShipmentFee REAL,
--     Tax REAL,
--     TotalAmount REAL,
--     FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID)
-- );

-- -- Bảng 19: Discounts
-- CREATE TABLE Discounts (
--     DiscountID INTEGER PRIMARY KEY AUTOINCREMENT,
--     InvoiceID INTEGER,
--     Name TEXT,
--     Credit REAL,
--     Percentage REAL,
--     StartDate DATETIME,
--     EndDate DATETIME,
--     Description TEXT,
--     Status TEXT,
--     FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID)
-- );

-- -- Bảng 20: Warehouses
-- CREATE TABLE Warehouses (
--     WarehouseID INTEGER PRIMARY KEY AUTOINCREMENT,
--     EmployeeID INTEGER,
--     Name TEXT,
--     Address TEXT,
--     Phone TEXT,
--     Description TEXT,
--     FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
-- );

-- -- Bảng 21: Exports
-- CREATE TABLE Exports (
--     ExportID INTEGER PRIMARY KEY AUTOINCREMENT,
--     WarehouseID INTEGER,
--     EmployeeID INTEGER,
--     ProductID INTEGER,
--     Quantity INTEGER,
--     Date DATETIME,
--     Status TEXT,
--     FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID),
--     FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
--     FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
-- );

-- -- Bảng 22: Imports
-- CREATE TABLE Imports (
--     ImportID INTEGER PRIMARY KEY AUTOINCREMENT,
--     WarehouseID INTEGER,
--     EmployeeID INTEGER,
--     ProductID INTEGER,
--     Quantity INTEGER,
--     Date DATETIME,
--     Status TEXT,
--     FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID),
--     FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
--     FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
-- );

-- -- Bảng 23: Orders_Discounts (Bảng liên kết - Khóa chính phức hợp, không dùng AUTOINCREMENT)
-- CREATE TABLE Orders_Discounts (
--     OrderID INTEGER,
--     DiscountID INTEGER,
--     PRIMARY KEY (OrderID, DiscountID),
--     FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
--     FOREIGN KEY (DiscountID) REFERENCES Discounts(DiscountID)
-- );
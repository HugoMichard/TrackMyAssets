CREATE TABLE users
(
  usr_id              INT unsigned NOT NULL AUTO_INCREMENT,# Unique ID for the user
  firstname           VARCHAR(150) NOT NULL,               # First Name of the user
  lastname            VARCHAR(150) NOT NULL,               # Last Name of the user
  email               VARCHAR(150) NOT NULL,               # Email of the user
  password            VARCHAR(150) NOT NULL,               # Password of the user
  created_at          DATE,
  PRIMARY KEY     (usr_id)                                  
);


ALTER TABLE users
ADD UNIQUE (email);


CREATE TABLE categories
(
  cat_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  name            VARCHAR(150) NOT NULL,
  color           VARCHAR(10) NOT NULL,
  PRIMARY KEY     (cat_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id)
);


CREATE TABLE assets
(
  ast_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  cat_id          INT unsigned NOT NULL,
  name            VARCHAR(150) NOT NULL,
  type            VARCHAR(150) NOT NULL,
  isin            VARCHAR(30),
  coin            VARCHAR(10),
  created_at      DATE,
  PRIMARY KEY     (ast_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id),
  FOREIGN KEY     (cat_id) REFERENCES categories(cat_id)                                            
);

CREATE TABLE orders
(
  ord_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  ast_id          INT unsigned NOT NULL,
  execution_date  DATE NOT NULL,
  vl              FLOAT NOT NULL,
  nbr_ast         FLOAT NOT NULL,
  fee             FLOAT,
  PRIMARY KEY     (ord_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id),
  FOREIGN KEY     (ast_id) REFERENCES assets(ast_id)                                            
);

CREATE TABLE history
(
  hst_id          INT unsigned NOT NULL AUTO_INCREMENT,
  ast_id          INT unsigned NOT NULL,
  hst_date        DATE NOT NULL,
  vl              FLOAT NOT NULL,
  PRIMARY KEY     (hst_id),
  FOREIGN KEY     (ast_id) REFERENCES assets(ast_id)
);
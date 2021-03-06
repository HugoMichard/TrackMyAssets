CREATE TABLE users
(
  usr_id              INT unsigned NOT NULL AUTO_INCREMENT,# Unique ID for the user
  firstname           VARCHAR(150) NOT NULL,               # First Name of the user
  lastname            VARCHAR(150) NOT NULL,               # Last Name of the user
  email               VARCHAR(150) UNIQUE NOT NULL,               # Email of the user
  password            VARCHAR(150) NOT NULL,               # Password of the user
  created_at          DATE,
  refresh_date        DATE,
  PRIMARY KEY     (usr_id)                                  
);


CREATE TABLE categories
(
  cat_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  name            VARCHAR(150) NOT NULL,
  color           VARCHAR(10) NOT NULL,
  PRIMARY KEY     (cat_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id)
);

CREATE TABLE platforms
(
  plt_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  dex_id          INT unsigned,
  name            VARCHAR(150) NOT NULL,
  color           VARCHAR(10) NOT NULL,
  wallet_address  VARCHAR(150),
  PRIMARY KEY     (plt_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id),
  FOREIGN KEY     (dex_id) REFERENCES dexs(dex_id)
);

CREATE TABLE cmc_coins
(
  cmc_id          INT unsigned NOT NULL AUTO_INCREMENT,
  cmc_official_id INT unsigned NOT NULL,
  name            VARCHAR(70),
  symbol		      VARCHAR(70),
  slug            VARCHAR(70),
  duplicate_nbr   INT NOT NULL,
  PRIMARY KEY     (cmc_id)                                      
);


CREATE TABLE assets
(
  ast_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  cat_id          INT unsigned NOT NULL,
  plt_id          INT unsigned,
  cmc_id          INT unsigned,
  duplicate_nbr   INT,
  name            VARCHAR(150) NOT NULL,
  ast_type        VARCHAR(150) NOT NULL,
  code            VARCHAR(30),
  fix_vl          FLOAT,
  rewards         FLOAT,
  created_at      DATE,
  PRIMARY KEY     (ast_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id),
  FOREIGN KEY     (cat_id) REFERENCES categories(cat_id),
  FOREIGN KEY     (cmc_id) REFERENCES cmc_coins(cmc_id),
  FOREIGN KEY     (plt_id) REFERENCES platforms(plt_id)
);

CREATE TABLE ast_import_names
(
  ain_id          INT unsigned NOT NULL AUTO_INCREMENT,
  ast_id          INT unsigned NOT NULL,
  name            VARCHAR(150) NOT NULL,
  PRIMARY KEY     (ain_id),
  FOREIGN KEY     (ast_id) REFERENCES assets(ast_id)
);

CREATE TABLE orders
(
  ord_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  ast_id          INT unsigned NOT NULL,
  gtg_ast_id      INT unsigned,
  plt_id          INT unsigned NOT NULL,
  execution_date  DATE NOT NULL,
  price           FLOAT NOT NULL,
  quantity        FLOAT NOT NULL,
  fees            FLOAT,
  PRIMARY KEY     (ord_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id),
  FOREIGN KEY     (plt_id) REFERENCES platforms(plt_id),
  FOREIGN KEY     (ast_id) REFERENCES assets(ast_id),
  FOREIGN KEY     (gtg_ast_id) REFERENCES assets(ast_id)
);

CREATE TABLE histories
(
  hst_id          INT unsigned NOT NULL AUTO_INCREMENT,
  hst_date        DATE NOT NULL,
  vl              FLOAT NOT NULL,
  code            VARCHAR(30) NOT NULL,
  PRIMARY KEY     (hst_id)
);

CREATE TABLE wires
(
  wir_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  execution_date  DATE NOT NULL,
  amount          FLOAT NOT NULL,
  target          VARCHAR(30),
  PRIMARY KEY     (wir_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id)                                        
);

CREATE TABLE dexs
(
  dex_id          INT unsigned NOT NULL AUTO_INCREMENT,
  name            VARCHAR(30) NOT NULL,
  reference_name  VARCHAR(50) NOT NULL,
  PRIMARY KEY     (dex_id)                                   
);

INSERT INTO dexs (name, reference_name)
VALUES  ('PancakeSwapBSC', 'pancakeswapBsc'),
        ('YieldYakAvax', 'yieldyakAvax'),
        ('BeefyFantom', 'beefyFantom'),
        ('BeefyAvax', 'beefyAvax'),
        ('AnchorTerra', 'anchorTerra'),
        ('RaydiumSolana', 'raydiumSolana'),
        ('OsmosisCosmos', 'osmosisCosmos'), 
        ('PylonTerra', 'pylonTerra');

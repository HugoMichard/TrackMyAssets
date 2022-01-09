CREATE TABLE users
(
  usr_id              INT unsigned NOT NULL AUTO_INCREMENT,# Unique ID for the user
  firstname           VARCHAR(150) NOT NULL,               # First Name of the user
  lastname            VARCHAR(150) NOT NULL,               # Last Name of the user
  email               VARCHAR(150) NOT NULL,               # Email of the user
  password            VARCHAR(150) NOT NULL,               # Password of the user
  created_at          DATE,
  refresh_date        DATE,
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

CREATE TABLE platforms
(
  plt_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  name            VARCHAR(150) NOT NULL,
  color           VARCHAR(10) NOT NULL,
  PRIMARY KEY     (plt_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id)
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
  cmc_id          INT unsigned,
  duplicate_nbr   INT,
  name            VARCHAR(150) NOT NULL,
  ast_type        VARCHAR(150) NOT NULL,
  code            VARCHAR(30),
  fix_vl          FLOAT,
  created_at      DATE,
  PRIMARY KEY     (ast_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id),
  FOREIGN KEY     (cat_id) REFERENCES categories(cat_id),
  FOREIGN KEY     (cmc_id) REFERENCES cmc_coins(cmc_id)                                                                                        
);

CREATE TABLE orders
(
  ord_id          INT unsigned NOT NULL AUTO_INCREMENT,
  usr_id          INT unsigned NOT NULL,
  ast_id          INT unsigned NOT NULL,
  plt_id          INT unsigned NOT NULL,
  execution_date  DATE NOT NULL,
  price           FLOAT NOT NULL,
  quantity        FLOAT NOT NULL,
  fees            FLOAT,
  PRIMARY KEY     (ord_id),
  FOREIGN KEY     (usr_id) REFERENCES users(usr_id),
  FOREIGN KEY     (plt_id) REFERENCES platforms(plt_id),
  FOREIGN KEY     (ast_id) REFERENCES assets(ast_id)                                            
);

CREATE TABLE histories
(
  hst_id          INT unsigned NOT NULL AUTO_INCREMENT,
  hst_date        DATE NOT NULL,
  vl              FLOAT NOT NULL,
  code            VARCHAR(30) NOT NULL,
  PRIMARY KEY     (hst_id)
);

CREATE TABLE dates
(
  random_date 		DATE NOT NULL UNIQUE,
  PRIMARY KEY     (random_date)                                           
);

INSERT INTO dates (random_date) 
SELECT DISTINCT STR_TO_DATE(a_date, '%Y-%m-%d') date_to_insert 
FROM (
	select adddate('2020-01-01', t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) a_date from
	 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
	 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
	 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
	 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3
  ) dates_to_insert;

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

ALTER TABLE platforms
	ADD COLUMN dex_id INT unsigned,
  ADD COLUMN wallet_address VARCHAR(150),
 	ADD	CONSTRAINT dex_id FOREIGN KEY (dex_id) REFERENCES dexs(dex_id);

INSERT INTO dexs (name, reference_name)
VALUES  ('PancakeSwapBSC', 'pancakeswapBsc'),
        ('YieldYakAvax', 'yieldyakAvax'),
        ('BeefyFantom', 'beefyFantom'),
        ('BeefyAvax', 'beefyAvax'),
        ('OsmosisCosmos', 'osmosisCosmos'), 
        ('PylonTerra', 'pylonTerra');

ALTER TABLE assets
  ADD COLUMN plt_id INT unsigned,
  ADD CONSTRAINT plt_id FOREIGN KEY (plt_id) REFERENCES platforms(plt_id);

ALTER TABLE assets
  ADD COLUMN rewards FLOAT;
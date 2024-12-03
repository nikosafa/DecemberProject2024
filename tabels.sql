-- MySQL CMD commands
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/navn_på_cvs.csv'
INTO TABLE tabel_name
FIELDS TERMINATED BY ';'
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE classification (
    ccpost_id DECIMAL(25,0) NOT NULL,
    all_post_text TEXT NOT NULL,
    gpt_ukraine_for_imod VARCHAR(255) NOT NULL
);

CREATE TABLE sourcepop (
    ccpageid BIGINT UNSIGNED NOT NULL, -- Stick to BIGINT UNSIGNED for storing large unique IDs 
    name VARCHAR(255) NOT NULL,
    party VARCHAR(255) DEFAULT NULL,
    category VARCHAR(255) DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL
);

CREATE TABLE time (
    ccpost_id DECIMAL(25,0) NOT NULL,          -- Large numeric ID for the post
    date DATE NOT NULL,                        -- Date in 'YYYY-MM-DD' format
    day TINYINT UNSIGNED NOT NULL,             -- Day of the month
    month TINYINT UNSIGNED NOT NULL,           -- Month of the year
    time TEXT NOT NULL,                    	   
    yearweek TINYINT UNSIGNED NOT NULL,        -- Week number within the year
    yearmonth CHAR(7) NOT NULL,                -- Year and month in 'YYYY-MM' format
    yearquarter CHAR(6) NOT NULL,              -- Year and quarter in 'YYYYQ#' format
    year SMALLINT UNSIGNED NOT NULL            -- Year in 'YYYY' format
);

CREATE TABLE metrics (
    ccpost_id DECIMAL(25,0) NOT NULL,
    ccpageid BIGINT UNSIGNED NOT NULL,
    post_type VARCHAR(50) NOT NULL,
    video_length DECIMAL(10,2) DEFAULT 0.00,
    followers_at_posting INT DEFAULT 0,
    reactions INT DEFAULT 0,
    likes INT DEFAULT 0,
    loves INT DEFAULT 0,
    wows INT DEFAULT 0,
    sads INT DEFAULT 0,
    hahas INT DEFAULT 0,
    angrys INT DEFAULT 0,
    cares INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    total_interactions INT DEFAULT 0,
    engagement_rate DECIMAL(20,16),
    proportion_of_likes DECIMAL(20,16),
    proportion_of_loves DECIMAL(20,16),
    proportion_of_hahas DECIMAL(20,16),
    proportion_of_wows DECIMAL(20,16),
    proportion_of_sads DECIMAL(20,16),
    proportion_of_angrys DECIMAL(20,16),
    proportion_of_cares DECIMAL(20,16),
    proportion_of_shares DECIMAL(20,16),
    proportion_of_comments DECIMAL(20,16),
    proportion_of_reactions DECIMAL(20,16)
);

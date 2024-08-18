-- Create and connect to the database
CREATE DATABASE reel_pals;

\c reel_pals

-- Drop existing tables
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS review_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    birthday DATE,
    picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
    follower_username VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
    followed_username VARCHAR(255) REFERENCES users(username) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_username, followed_username)
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    imdb_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    year INTEGER,
    actor1 VARCHAR(255),
    actor2 VARCHAR(255),
    actor3 VARCHAR(255),
    country VARCHAR(255),
    director VARCHAR(255),
    genre1 VARCHAR(100),
    genre2 VARCHAR(100),
    genre3 VARCHAR(100),
    plot TEXT,
    poster_url TEXT,
    rated VARCHAR(10),
    imdb_rating VARCHAR(10),
    rotten_tomatoes_rating VARCHAR(10),
    metacritic_rating VARCHAR(10),
    released VARCHAR(50),
    runtime VARCHAR(50),
    writer VARCHAR(255)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    user_username VARCHAR REFERENCES users(username) ON DELETE CASCADE,
    movie_imdb_id VARCHAR REFERENCES movies(imdb_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    poster VARCHAR
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_username VARCHAR REFERENCES users(username) ON DELETE CASCADE,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
    user_username VARCHAR REFERENCES users(username) ON DELETE CASCADE,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_username, review_id)
);

-- Insert data

-- Insert users data
COPY users(id, username, email, hashed_password, first_name, last_name, birthday, picture, created_at)
FROM stdin DELIMITER ',' CSV HEADER;
31,bigboydeluxe,big@boy.com,$2b$12$4r9XU525nViiwjCmo2zil.YeKrqJJN3lQOHjrj8Eak463bYvXHZMy,biggest,boy,1999-05-21,https://i.imgur.com/ke9rj5t.jpeg,2024-08-09 10:33:54.512475
32,bigboydeluxe1,bogger@boy.com,$2b$12$vjLcH52zohFuWrKFXOsKBeTNFyd./pPcS2uBCZqjJu8Bjhgl5uvCW,bigger,boy,2002-04-21,https://i.imgur.com/K6ORUJk.png,2024-08-11 21:43:19.115543
34,bobobob,bob@kevin.com,$2b$12$KjLIlbDHGwZoAOTy6lJ9XOwxVYLvNbpThvQAWhPoeNsC4YqHF2f06,bob,stuart,2002-02-12,https://i.imgur.com/K6ORUJk.png,2024-08-12 22:55:13.735858
1,user1,user1@example.com,hashed_password1,John,Doe,1990-01-01,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
13,user13,user13@example.com,hashed_password13,Daniel,Lee,1986-01-30,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
14,user14,user14@example.com,hashed_password14,Sophia,García,1991-02-25,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
15,user15,user15@example.com,hashed_password15,Ethan,Martinez,1995-03-18,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
16,user16,user16@example.com,hashed_password16,Ava,Rodriguez,1989-04-14,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
17,user17,user17@example.com,hashed_password17,Mason,Wilson,1992-05-23,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
18,user18,user18@example.com,hashed_password18,Isabella,Moore,1994-06-29,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
19,user19,user19@example.com,hashed_password19,Jacob,Taylor,1993-07-16,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
20,user20,user20@example.com,hashed_password20,Charlotte,Jackson,1990-08-21,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
21,user21,user21@example.com,hashed_password21,William,White,1995-09-09,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
22,user22,user22@example.com,hashed_password22,Ella,Harris,1988-10-14,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
23,user23,user23@example.com,hashed_password23,Alexander,Martin,1994-11-17,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
24,user24,user24@example.com,hashed_password24,Mia,Thompson,1991-12-20,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
25,user25,user25@example.com,hashed_password25,Benjamin,García,1986-01-25,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
26,user26,user26@example.com,hashed_password26,Harper,Wilson,1992-02-18,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
27,user27,user27@example.com,hashed_password27,James,Jackson,1987-03-13,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
28,user28,user28@example.com,hashed_password28,Evelyn,Taylor,1993-04-22,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
29,user29,user29@example.com,hashed_password29,Henry,Moore,1994-05-15,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
30,user30,user30@example.com,hashed_password30,Zoe,Harris,1989-06-30,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
33,wayala,W@randy.com,$2b$12$66cD74r3MwHTPLDAl8Ekw..qrlHDMuHwNfTC6a/F.1FZ1NugsJ19W,Brook,Lyn,1999-03-29,https://i.imgur.com/K6ORUJk.png,2024-08-11 23:31:53.702604
35,catinthehat,cat@hat.com,$2b$12$tZAp/AYXPI2Lvvyslkrw0ezzXnLFNRo29PtPAKaGw4sZ13wYvCdLa,Mike,Meyers,1975-04-15,https://i.imgur.com/K6ORUJk.png,2024-08-12 23:01:11.8603
2,user2,user2@example.com,hashed_password2,Jane,Smith,1985-02-15,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
3,user3,user3@example.com,hashed_password3,Michael,Brown,1992-03-23,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
4,user4,user4@example.com,hashed_password4,Emily,Davis,1988-04-30,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
5,user5,user5@example.com,hashed_password5,David,Wilson,1995-05-17,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
6,user6,user6@example.com,hashed_password6,Sarah,Miller,1991-06-22,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
7,user7,user7@example.com,hashed_password7,Chris,Anderson,1993-07-29,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
8,user8,user8@example.com,hashed_password8,Jessica,Thomas,1989-08-14,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
9,user9,user9@example.com,hashed_password9,James,Jackson,1994-09-19,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
10,user10,user10@example.com,hashed_password10,Amanda,White,1992-10-05,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
11,user11,user11@example.com,hashed_password11,Matthew,Harris,1987-11-12,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
12,user12,user12@example.com,hashed_password12,Olivia,Martin,1990-12-21,https://i.imgur.com/K6ORUJk.png,2024-08-09 10:27:54.95638
\.

-- Insert movies data
COPY movies(id, imdb_id, title, year, actor1, actor2, actor3, country, director, genre1, genre2, genre3, plot, poster_url, rated, imdb_rating, rotten_tomatoes_rating, metacritic_rating, released, runtime, writer)
FROM stdin DELIMITER ',' CSV HEADER;
1,tt0121111,Patarouva,1959,Tuija Halonen,Sinikka Hannula,Kerttu Hämeranta,Finland,Maunu Kurkvaara,Drama,,,"The bachelor Kaius Kannisto think back on the females he has picked up over the years, naming some of them after playing cards. Sia the Queen of diamonds, Pia the Queen of clubs, Eeva the the Queen of hearts, and Elina.",https://m.media-amazon.com/images/M/MV5BZDkzYmFmNWMtNjExNi00YTQ0LWFiNWEtYzJlZjllYjhmMjhiXkEyXkFqcGdeQXVyMTIxMzMzMzE@._V1_SX300.jpg,N/A,4.8/10,,,09 Oct 1959,96 min,"Maunu Kurkvaara, Oiva Paloheimo"
2,tt0122222,Das Rasthaus der grausamen Puppen,1967,Essy Persson,Helga Anders,Erik Schumann,"Italy, West Germany",Rolf Olsen,Crime,Drama,,Rogue couple Betty Williams and Bob Fishman attempt to rob a jewelry store in Glasgow. The plan fails and a policeman is killed.,https://m.media-amazon.com/images/M/MV5BMDM3MTkyZjktNmI3MS00OWExLWI0ZjYtZTgxYTYwYThjYWJhXkEyXkFqcGdeQXVyNjUzNzQ4NDQ@._V1_SX300.jpg,N/A,7.1/10,,,06 Jun 1967,96 min,Rolf Olsen
3,tt0076759,Star Wars: Episode IV - A New Hope,1977,Mark Hamill,Harrison Ford,Carrie Fisher,United States,George Lucas,Action,Adventure,Fantasy,"The Imperial Forces, under orders from cruel Darth Vader, hold Princess Leia hostage in their efforts to quell the rebellion against the Galactic Empire. Luke Skywalker and Han Solo, captain of the Millennium Falcon, work together with the companionable droid duo R2-D2 and C-3PO to rescue the beautiful princess, help the Rebel Alliance and restore freedom and justice to the Galaxy.",https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg,PG,8.6/10,93%,90/100,25 May 1977,121 min,George Lucas
4,tt0080684,Star Wars: Episode V - The Empire Strikes Back,1980,Mark Hamill,Harrison Ford,Carrie Fisher,United States,Irvin Kershner,Action,Adventure,Fantasy,"Luke Skywalker, Han Solo, Princess Leia and Chewbacca face attack by the Imperial forces and its AT-AT walkers on the ice planet Hoth. While Han and Leia escape in the Millennium Falcon, Luke travels to Dagobah in search of Yoda. Only with the Jedi Master's help will Luke survive when the Dark Side of the Force beckons him into the ultimate duel with Darth Vader.",https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg,PG,8.7/10,95%,82/100,18 Jun 1980,124 min,"Leigh Brackett, Lawrence Kasdan, George Lucas"
5,tt0086190,Star Wars: Episode VI - Return of the Jedi,1983,Mark Hamill,Harrison Ford,Carrie Fisher,United States,Richard Marquand,Action,Adventure,Fantasy,"Luke Skywalker battles Jabba the Hutt and Darth Vader to save his comrades in the Rebel Alliance and triumph over the Galactic Empire. Han Solo and Princess Leia reaffirm their love, and team with Chewbacca, Lando Calrissian, the Ewoks, and droids C-3PO and R2-D2 to aid in the disruption of the Dark Side, and the defeat of the evil emperor.",https://m.media-amazon.com/images/M/MV5BOWZlMjFiYzgtMTUzNC00Y2IzLTk1NTMtZmNhMTczNTk0ODk1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg,PG,8.3/10,82%,58/100,25 May 1983,131 min,"Lawrence Kasdan, George Lucas"
6,tt2036416,You Are the Apple of My Eye,2011,Kai Ko,Michelle Chen,Shao-Wen Hao,Taiwan,Giddens Ko,Comedy,Drama,Romance,"A coming-of-age story featuring a group of Taiwanese teenage friends and their experiences as they all fall in love with the same girl: Shen Jiayi, the star student of the school. A story about the complexities and bittersweetness of high-school life set against the backdrop of Taiwanese culture and traditions.",https://m.media-amazon.com/images/M/MV5BMWU2OTAyMTktMTU5MC00MTNhLTg1NzAtOTZjNWFjMDRiZGUxXkEyXkFqcGdeQXVyNDY3MzUxOTI@._V1_SX300.jpg,N/A,7.5/10,,,19 Aug 2011,109 min,Giddens Ko
7,tt4649558,The Radicalization of Jeff Boyd,2017,Uwe Schwarzwalder,Yessi Sanchez,Zarina Tadjibaeva,Switzerland,Uwe Schwarzwalder,Crime,Thriller,,A businessman and a young woman find each other and discuss a dangerous plan which soon becomes reality.,https://m.media-amazon.com/images/M/MV5BYTQ2ZWJlZTUtNWFlZC00YjBhLTlhOWEtNGQ4NDBhNjAzNGI0XkEyXkFqcGdeQXVyMjU3MzQ3NjE@._V1_SX300.jpg,N/A,6.7/10,,,05 Nov 2017,117 min,Uwe Schwarzwalder
8,tt0222012,Hey Ram,2000,Kamal Haasan,Shah Rukh Khan,Rani Mukerji,India,Kamal Haasan,Crime,Drama,History,"The film starts with Saketh Ram as a very old man and almost immediately goes into flashback. As a young man he is among his friends, in conviviality. He has taken a Bengali wife, Aparna, and everything is wonderful in his life, However the year is 1946, and the imminent independence of India from British suzerainty is complicated by religious antagonism between the Hindu majority and the large Muslim minority, who demand their own independent state. Saketh and Aparna visit Calcutta; rioting is reported, but Saketh goes out to get some food, and he soon encounters a Hindu woman being chased by Muslim rioters. He rescues her, but the rioters later come to his house, and brutally rape and then kill his wife. Saketh is devastated and takes to the streets, determined personally to kill as many Muslims as he can find. He meets up with Sriram Abhiyankar, who is leading a group of Hindu extremists, and Saketh becomes temporarily taken with the cause himself. At the same time, he is persuaded to take a new wife, Mythili, and life begins to stabilize for Saketh after all. However he then falls in with an eminent Maharajah who is leading an underground group with the intention of assassination. Travelling with the Maharajah, Saketh meets one of his old friends from younger days, who has fallen on hard times. Reminiscing, and getting his old friend back on his feet deflect the process of recruiting Saketh, but only temporarily, and soon he is manipulated into committing himself to renouncing his family and his new wife, in the interests of the cause which now is disclosed as the assassination of Gandhi. Although a fellow Hindu, Gandhi was felt by some to be too conciliatory to Muslims and in the logic of extremists, Gandhi became the prime target. Soon Saketh is informed that Gandhi will be in Delhi for some weeks, and that Saketh is to take the opportunity to do ""his duty"". However, hiding from a snap search by the police, he has to hide his pistol on a delivery lorry, and it is driven away to a factory owned by Muslims. Going there hoping to retrieve the gun, he becomes engulfed in a shoot-out between some Hindu attackers and the Muslims, and finds that his loyalties are not so clear cut as he had imagined. Finally he escapes after the death of another of his old friends in the crossfire. The next day, January 30th 1948, he contrives to be near Gandhi in a public prayer ground, his appointment with destiny. But the film still has 20 minutes to run, and the ending is not what you expect.",https://m.media-amazon.com/images/M/MV5BYzMxYzZjMDUtZjI3Ni00Y2M2LTllYWItNzJmZTJjMzkyYjlmXkEyXkFqcGdeQXVyODEzOTQwNTY@._V1_SX300.jpg,Not Rated,7.9/10,,,18 Feb 2000,186 min,"H. Banerjee, Kamal Haasan, Manohar Shyam Joshi"
9,tt1307068,Seeking a Friend for the End of the World,2012,Steve Carell,Keira Knightley,Melanie Lynskey,United States,Lorene Scafaria,Adventure,Comedy,Drama,"An asteroid named ""Matilda"" is on a collision course towards Earth and in three weeks the world will come to an absolute end. What would you do if your life and the world were doomed? One man decides to spend his time searching for his long lost love from high school during the coming catastrophe.",https://m.media-amazon.com/images/M/MV5BMTk4MDQ1NzE3N15BMl5BanBnXkFtZTcwMjA0MDkzNw@@._V1_SX300.jpg,R,6.7/10,55%,59/100,22 Jun 2012,101 min,Lorene Scafaria
10,tt1392170,The Hunger Games,2012,Jennifer Lawrence,Josh Hutcherson,Liam Hemsworth,United States,Gary Ross,Action,Adventure,Sci-Fi,"In a dystopian future, the totalitarian nation of Panem is divided into 12 districts and the Capitol. Each year two young representatives from each district are selected by lottery to participate in The Hunger Games. Part entertainment, part brutal retribution for a past rebellion, the televised games are broadcast throughout Panem. The 24 participants are forced to eliminate their competitors while the citizens of Panem are required to watch. When 16-year-old Katniss' young sister, Prim, is selected as District 12's female representative, Katniss volunteers to take her place. She and her male counterpart, Peeta, are pitted against bigger, stronger representatives, some of whom have trained for this their whole lives.",https://m.media-amazon.com/images/M/MV5BZWI1OWM3ZmEtNjQ2OS00NzI2LTgwNWMtZDAyMGI1OTM2MzJmXkEyXkFqcGdeQXVyNjc5NjEzNA@@._V1_SX300.jpg,PG-13,7.2/10,84%,68/100,23 Mar 2012,142 min,"Gary Ross, Suzanne Collins, Billy Ray"
\.

-- Insert reviews data
COPY reviews(id, rating, title, body, user_username, movie_imdb_id, created_at, poster)
FROM stdin DELIMITER ',' CSV HEADER;
133,2,Disappointing Sequel,The sequel was disappointing compared to the original.,user4,tt0080684,2023-10-16 13:46:19.336843,https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg
8,3,"Not Bad","The movie was decent but didn't quite live up to the hype. Some interesting moments, but overall it felt lacking.",user1,tt0076759,2024-08-09 10:32:35.444388,https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg
13,3,"Not Bad","The movie was decent but didn't quite live up to the hype. Some interesting moments, but overall it felt lacking.",user1,tt0076759,2024-08-09 10:33:19.304689,https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg
137,2,"Underwhelming","Underwhelming experience with weak storyline.",user8,tt0222012,2024-04-01 05:03:41.950653,https://m.media-amazon.com/images/M/MV5BYzMxYzZjMDUtZjI3Ni00Y2M2LTllYWItNzJmZTJjMzkyYjlmXkEyXkFqcGdeQXVyODEzOTQwNTY@._V1_SX300.jpg
9,2,"Disappointing","I was disappointed with this film. The storyline was weak, and the characters were not engaging.",user1,tt0080684,2024-08-09 10:32:35.444388,https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg
16,3,"Good But Forgettable","The film was good but nothing special. It's one of those movies that you forget about soon after watching.",user2,tt2036416,2024-08-09 10:33:19.304689,https://m.media-amazon.com/images/M/MV5BMWU2OTAyMTktMTU5MC00MTNhLTg1NzAtOTZjNWFjMDRiZGUxXkEyXkFqcGdeQXVyNDY3MzUxOTI@._V1_SX300.jpg
17,4,"Solid Performance","A solid performance by the cast. The movie had its moments, and I enjoyed the overall experience.",user2,tt4649558,2024-08-09 10:33:19.304689,https://m.media-amazon.com/images/M/MV5BYTQ2ZWJlZTUtNWFlZC00YjBhLTlhOWEtNGQ4NDBhNjAzNGI0XkEyXkFqcGdeQXVyMjU3MzQ3NjE@._V1_SX300.jpg
18,5,"Highly Entertaining","Absolutely entertaining from start to finish. The plot twists kept me on the edge of my seat. Great movie!",user2,tt0222012,2024-08-09 10:33:19.304689,https://m.media-amazon.com/images/M/MV5BYzMxYzZjMDUtZjI3Ni00Y2M2LTllYWItNzJmZTJjMzkyYjlmXkEyXkFqcGdeQXVyODEzOTQwNTY@._V1_SX300.jpg
19,2,"Mediocre","The movie was mediocre at best. It didn't have much substance and felt very predictable.",user2,tt1307068,2024-08-09 10:33:19.304689,https://m.media-amazon.com/images/M/MV5BMTk4MDQ1NzE3N15BMl5BanBnXkFtZTcwMjA0MDkzNw@@._V1_SX300.jpg
20,3,"Entertaining","An entertaining film but with some flaws. It was a decent watch but didn't quite meet expectations.",user2,tt1392170,2024-08-09 10:33:19.304689,https://m.media-amazon.com/images/M/MV5BZWI1OWM3ZmEtNjQ2OS00NzI2LTgwNWMtZDAyMGI1OTM2MzJmXkEyXkFqcGdeQXVyNjc5NjEzNA@@._V1_SX300.jpg
\.

-- Insert comments data
COPY comments(id, review_id, body, created_at, user_username)
FROM stdin DELIMITER ',' CSV HEADER;
2,15,yayyyyyyyy,2024-08-11 15:56:07.844245,bigboydeluxe
3,15,"This is a comment",2024-08-11 16:26:53.856535,bigboydeluxe
4,15,"I agree with your take on the issue",2024-08-11 16:27:32.509307,bigboydeluxe
5,32,"Wow such a great review",2024-08-11 16:28:46.104235,bigboydeluxe
6,130,"I really enjoyed this review, very insightful!",2024-01-23 07:26:40.669448,user1
7,131,"Great review! I found it very helpful.",2024-06-02 01:44:51.558562,user2
8,132,"I disagree with some points, but overall good review.",2023-11-24 19:49:12.401083,user3
9,133,"Not a fan of this review, seemed a bit harsh.",2023-11-13 20:40:46.990617,user4
10,134,"This review captured the essence of the movie perfectly.",2023-10-11 02:56:03.263301,user5
11,6,"Very detailed and well-written review!",2024-05-08 19:17:32.294409,user6
12,7,"I liked this review, but I wish it was more critical.",2024-06-07 13:32:44.333491,user7
13,8,"Good review, but I had a different experience with the movie.",2023-12-31 20:50:50.324783,user8
14,9,"This review was quite comprehensive, thanks for sharing!",2023-11-10 21:19:27.525679,user9
15,10,"Interesting perspective on the film, thanks for the review.",2024-06-02 18:56:18.761462,user10
16,11,"I found this review to be quite informative.",2023-10-27 10:59:43.818051,user11
17,12,"The review was good, but I think it missed some key details.",2024-05-08 23:16:37.639094,user12
18,13,"Great review, very engaging and well-written.",2023-10-22 08:45:21.924819,user13
19,14,"I liked the review, but the analysis could be deeper.",2024-08-08 07:20:40.309268,user14
20,15,"The review was good, though I expected more depth.",2023-09-20 12:31:02.965647,user15
21,16,"Excellent review, very detailed and insightful.",2024-06-06 18:37:14.226865,user16
22,17,"The review was okay, but I didn't agree with all the points.",2023-11-27 09:46:17.769686,user17
23,18,"Interesting take on the movie, enjoyed reading it.",2023-08-21 11:22:30.413301,user18
24,19,"I found the review to be quite informative and helpful.",2024-06-16 19:48:10.98332,user19
25,20,"The review was decent, though I think it could have been better.",2023-12-18 06:15:37.450898,user20
26,21,"I appreciated the review, but I had a different view on the film.",2024-08-02 20:30:30.280029,user21
27,22,"Good review with a fair amount of detail.",2024-04-06 09:40:17.137937,user22
28,23,"The review was insightful, but it missed a few key points.",2024-02-19 21:51:19.221437,user23
29,24,"I enjoyed this review, it was quite thorough.",2024-04-12 00:09:44.775989,user24
30,25,"The review was okay, but I would have liked more analysis.",2024-02-02 10:57:02.181793,user25
31,26,"Interesting review, though I didn't fully agree with it.",2024-01-08 13:40:35.321577,user26
32,27,"Great review, very detailed and engaging.",2023-08-16 19:25:31.232452,user27
33,28,"The review was good, but I had a different experience with the film.",2024-02-16 13:57:01.232931,user28
34,29,"I found this review to be quite useful, thanks!",2023-12-11 15:09:03.393415,user29
35,30,"The review was decent, though it could have been more critical.",2023-11-22 05:02:59.707409,user30
\.

-- Insert follows data
COPY follows(follower_username, followed_username, created_at)
FROM stdin DELIMITER ',' CSV HEADER;
bigboydeluxe,user29,2024-08-11 11:36:06.983871
bigboydeluxe,user1,2024-08-09 11:01:04.187629
bigboydeluxe,user2,2024-08-09 11:01:08.656226
bigboydeluxe,user3,2024-08-09 11:01:12.787314
bigboydeluxe,user4,2024-08-09 11:01:21.985477
bigboydeluxe,user5,2024-08-09 11:01:27.852944
bigboydeluxe,user6,2024-08-09 11:01:34.651071
bigboydeluxe,user7,2024-08-09 11:01:40.232794
bigboydeluxe,user9,2024-08-09 11:01:45.152133
bigboydeluxe,user10,2024-08-09 11:02:13.130949
bigboydeluxe,user11,2024-08-09 11:02:17.836442
bigboydeluxe,user12,2024-08-09 11:02:23.666063
bigboydeluxe,user15,2024-08-09 11:03:29.501153
bigboydeluxe,user30,2024-08-11 11:37:01.237817
bigboydeluxe,user13,2024-08-11 15:33:59.114143
bigboydeluxe,user28,2024-08-11 16:29:04.526448
bigboydeluxe1,bigboydeluxe,2024-08-11 21:43:28.60965
bigboydeluxe,bigboydeluxe1,2024-08-11 21:44:31.191636
bigboydeluxe,user26,2024-08-09 14:46:01.299805
bigboydeluxe,user22,2024-08-15 15:37:08.316775
bigboydeluxe,user18,2024-08-10 14:13:36.448397
\.

-- Insert likes data
COPY likes(review_id, created_at, user_username)
FROM stdin DELIMITER ',' CSV HEADER;
32,2024-08-11 16:28:31.807258,bigboydeluxe
132,2024-08-11 20:23:20.127053,user1
8,2024-08-11 20:23:20.127053,user13
13,2024-08-11 20:23:20.127053,user14
133,2024-08-11 20:23:20.127053,user15
9,2024-08-11 20:23:20.127053,user16
134,2024-08-11 20:23:20.127053,user17
16,2024-08-11 20:23:20.127053,user18
135,2024-08-11 20:23:20.127053,user19
17,2024-08-11 20:23:20.127053,user20
136,2024-08-11 20:23:20.127053,user21
18,2024-08-11 20:23:20.127053,user22
137,2024-08-11 20:23:20.127053,user23
19,2024-08-11 20:23:20.127053,user24
20,2024-08-11 20:23:20.127053,user25
21,2024-08-11 20:23:20.127053,user26
22,2024-08-11 20:23:20.127053,user27
23,2024-08-11 20:23:20.127053,user28
24,2024-08-11 20:23:20.127053,user29
25,2024-08-11 20:23:20.127053,user30
\.

-- Update sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('movies_id_seq', (SELECT MAX(id) FROM movies));
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));

-- Add any additional constraints or indexes here

-- Create test database
CREATE DATABASE reel_pals_test;

\c reel_pals_test
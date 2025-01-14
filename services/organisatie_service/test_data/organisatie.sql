--
-- PostgreSQL database dump
--

-- Dumped from database version 13.11
-- Dumped by pg_dump version 13.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: organisaties; Type: TABLE DATA; Schema: public; Owner: hhb
--

INSERT INTO public.organisaties VALUES (1, '000023683899', 'Belastingdienst Toeslagen Kantoor Utrecht', '27365323', '26f1f82a-caf0-468a-bbcf-772d37949fbd');
INSERT INTO public.organisaties VALUES (2, '000026319926', 'CAK', '56806787', '25e7590a-b66a-47db-aab3-2b6719272d5f');
INSERT INTO public.organisaties VALUES (3, '000000299391', 'Dienst Uitvoering Onderwijs', '50973029', 'c52f640f-a69a-4919-b2d9-7267c72cd708');
INSERT INTO public.organisaties VALUES (4, '000005203368', 'Gemeente Utrecht', '30280353', '18f8222f-8275-49b7-be9b-051e7b0dcd4b');
INSERT INTO public.organisaties VALUES (5, '000007246382', 'Sociale Verzekeringsbank', '34366008', '8d717a80-7748-45c9-871e-200ecb91dfdd');
INSERT INTO public.organisaties VALUES (6, '000010718842', 'UWV Utrecht', '34360247', 'cbf0a3e3-973c-4164-a3f8-e96f9a5b41d3');
INSERT INTO public.organisaties VALUES (7, '000000000000', 'Stichting Vaste Lasten Pakket', '73834238', 'b499421b-7558-4924-a4df-eca4af9bea86');
INSERT INTO public.organisaties VALUES (8, '000015447650', 'Vitens N.V.', '05069581', 'f23877e8-95cc-4323-9897-d4c400863abd');
INSERT INTO public.organisaties VALUES (9, '000000595233', 'Stichting Mitros', '30136131', '73edb417-ea8c-4e06-b67b-27e1fadb9070');
INSERT INTO public.organisaties VALUES (10, '000002799669', 'Stichting Portaal', '30038487', '6c48bf35-d145-4204-83f4-2d8755aebd08');
INSERT INTO public.organisaties VALUES (11, '000017772559', 'De Nederlandse Energie Maatschappij', '34297646', 'e27a8f9e-37cb-40a2-be70-32ae1412e295');
INSERT INTO public.organisaties VALUES (12, '000016418557', 'Eneco Consumenten B.V.', '24324527', '53ee5c75-3564-41a3-9743-640a1cee235c');
INSERT INTO public.organisaties VALUES (13, '000016985524', 'Energiedirect B.V.', '17146989', '159d102c-cd2a-4310-9887-709a06fd015e');
INSERT INTO public.organisaties VALUES (14, '000020223862', 'ENGIE Nederland Retail B.V.', '05082820', '903c543f-515f-4dea-aeb9-fc560b71117e');
INSERT INTO public.organisaties VALUES (15, '000016784626', 'Essent Retail Energie B.V.', '13041611', '48154d10-72f5-4a21-9111-22826166df62');
INSERT INTO public.organisaties VALUES (16, '000020842066', 'Anderzorg N.V.', '50544403', '15645348-4f8c-4b66-8ea4-97631f69f8ea');
INSERT INTO public.organisaties VALUES (17, '000016548582', 'Coöperatie VGZ U.A.', '10029718', '89f73329-2513-485d-a7dd-43feb157cedb');
INSERT INTO public.organisaties VALUES (18, '000004636074', 'CZ Groep Aanvullende Verzekering Zorgverzekeraar', '18028752', 'bdc35fb3-cae9-41cd-b0a1-b74c85168fe6');
INSERT INTO public.organisaties VALUES (19, '000018569463', 'DSW Ziektekostenverzekeringen N.V.', '24230430', 'b5ee2d07-365c-4199-b811-77e5fd2ffd66');
INSERT INTO public.organisaties VALUES (20, '000018994245', 'FBTO Zorgverzekeringen N.V.', '30208631', '936ceaa1-22c1-48be-bf95-55d8a6d700b2');
INSERT INTO public.organisaties VALUES (21, '000040446425', 'Stichting Zorg en Zekerheid', '41168265', '12a8c3c9-0910-42f3-9134-2649afffb0bd');
INSERT INTO public.organisaties VALUES (22, '000037991752', 'RISK Direct B.V.', '69653852', 'd5647546-ae85-4033-a324-d1efdd4b7e17');
INSERT INTO public.organisaties VALUES (23, '000018360785', 'Albert Heijn B.V.', '35012085', '71ac5d69-2afb-4be6-a544-f5eb99a8c4b6');
INSERT INTO public.organisaties VALUES (24, '000016430921', 'KPN B.V.', '27124701', '86b4b859-ec75-44bf-ad3d-3b5e7d57f8e2');
INSERT INTO public.organisaties VALUES (25, '000016160703', 'Vodafone Libertel B.V.', '14052264', 'c17b9706-ac35-4fc9-95be-fc8431a7bc08');


--
-- Data for Name: afdelingen; Type: TABLE DATA; Schema: public; Owner: hhb
--

INSERT INTO public.afdelingen VALUES (12, 'UWV, afdeling WAZO/ZEZ (vanaf 1-7-2019)', 6, '{98ecf73e-4476-4d30-a343-7858e1c39428}', '{10,11,12,13}', 'dd160770-f566-4cc3-a31b-e44d3f3fcc19', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (1, 'Belastingdienst Toeslagen Kantoor Utrecht', 1, '{86d3a8a1-2669-450e-b950-fa1cd1b7ae04}', '{1,2}', '38111894-0ef4-4d55-ad88-dcb8f54e89cc', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (2, 'CAK', 2, '{b3a677f1-a900-418e-9c1c-9b31f42c83ba}', '{3}', 'cab3246b-ff59-4a4b-a40d-4de085964ec4', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (22, 'Energiedirect B.V.', 13, '{92a9f7cc-a707-4d19-9340-993c61b3b13d}', '{22}', '5061edc7-0112-432b-bae5-a4a6c8e0d80b', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (3, 'Dienst Uitvoering Onderwijs', 3, '{71c8c890-9a9a-4c7d-ba9b-8cd16a284b18}', '{4}', '8f9fa2f6-2a54-41f3-8d18-77d68962abc8', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (23, 'ENGIE Nederland Retail B.V.', 14, '{deea14f7-f54a-44cd-af99-92405867aa3a}', '{23}', 'e3397c54-ea0a-4332-afe3-892f17dcd993', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (13, 'UWV, afdeling WIA', 6, '{b25a8c28-7869-4ca9-a732-54451cd75146}', '{10,11,12,13}', 'd69548f6-87dc-4b4e-bba0-52b53074f818', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (4, 'Gemeente Utrecht', 4, '{3ee2d62d-1fea-4e55-9332-73cd3687079c}', '{5,6,7,8}', '0f411916-9cf2-410a-a503-f70682026a14', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (5, 'Sociale Verzekeringsbank', 5, '{4726129c-3913-4f09-9c3a-e3898cb36748}', '{9}', '27764fc0-6e28-4661-977b-37fdef851a50', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (31, 'RISK Direct B.V.', 22, '{5ee24625-5c46-4bae-85a9-d093ac499757}', '{31}', '44c78529-420f-4a41-be5a-77a6e54477cb', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (24, 'Essent Retail Energie B.V.', 15, '{c7099141-d427-42e1-943c-d332978265a0}', '{24}', '589ed59c-5c85-4d56-b692-1f2d9b2f5a16', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (6, 'UWV, afdeling WW', 6, '{5b2b3fe2-344a-43a8-964d-d125da1563cf}', '{10,11,12,13}', '710c5f87-a250-4c81-a0a4-80db1540a130', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (14, 'UWV, afdeling IOW', 6, '{a94ccbf6-1504-49b8-91f1-2958a68dede5}', '{10,11,12,13}', '09080cae-8dfe-464a-b72e-a79d1b41b7a7', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (25, 'Anderzorg N.V.', 16, '{bed2bfcd-1a84-4617-ada0-b84d1fd567ef}', '{25}', '40c6278c-2e10-4579-b76f-6104bc446b49', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (7, 'UWV, afdeling Wajong', 6, '{a644596c-5a03-4ca3-8236-41251f9e0013}', '{10,11,12,13}', '3c37eb4f-4f49-43c4-8332-12ecbb89a3ac', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (15, 'UWV, afdeling Beoordeling arbeidsvermogen', 6, '{f9a2e15d-4453-421b-9c5a-bdd27b6698f8}', '{10,11,12,13}', 'b7fb0619-ff07-4184-b223-10d776fd3d1c', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (8, 'UWV, afdeling WAO', 6, '{08bc74d3-246f-459e-ad6a-1c802d2cb03c}', '{10,11,12,13}', '4fe0949a-97dc-4e83-9df6-09170f6bc579', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (26, 'Coöperatie VGZ U.A.', 17, '{44930f05-981a-4676-a1c6-3a587e999982}', '{26}', 'f3270752-3123-4cbe-8b7a-1fccc7201dd3', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (16, 'Stichting Vaste Lasten Pakket', 7, '{d720d02e-36ab-462b-8556-5d3d1fcd5271}', '{14}', 'b312836f-97ff-4017-8515-82ef6401d621', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (9, 'UWV, afdeling WAZ', 6, '{cb0617f6-ef69-42a1-b41b-add994a465bb}', '{10,11,12,13}', '1684b0d7-ae23-45a3-9aa4-459f6477bc66', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (17, 'Vitens N.V.', 8, '{5ba58c89-cfec-4828-8255-595801a08877}', '{15}', 'd11ca248-598b-4057-b8f0-1842af65a350', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (32, 'Albert Heijn B.V.', 23, '{5032338e-8527-4928-93fa-2b6438ef68cc}', '{32}', '2d0253fa-3485-4cde-957a-39356f714b9a', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (27, 'CZ Groep Aanvullende Verzekering Zorgverzekeraar', 18, '{1b4f3be0-75de-402e-82fa-9e313b9375fa}', '{27}', 'e731289b-1dc1-4ea0-93cf-6de332b85066', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (10, 'UWV, afdeling ZW', 6, '{27ce93c8-afe3-4b30-994e-d81689e307d4}', '{10,11,12,13}', '612ad4bf-cbb6-4006-a646-fa6676eac781', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (18, 'Stichting Mitros', 9, '{688188d7-587e-42a6-b48c-5b97fa403386}', '{16,17}', '27ea219c-1ab5-4820-9bd3-07ec6e574cf7', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (11, 'UWV, afdeling WAZO/ZEZ (tot 1-7-2019)', 6, '{b491feb6-0eae-4788-9eba-c88c352e6642}', '{10,11,12,13}', '02d03a73-2223-4a04-9b14-9806797f8dae', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (19, 'Stichting Portaal', 10, '{c200a477-b3da-4f12-9a40-913e1650a8a4}', '{18,19}', 'ddf5e589-b33a-4429-92e0-7b9a3e1b5345', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (28, 'DSW Ziektekostenverzekeringen N.V.', 19, '{24b76a89-8baf-41d6-99a0-9203678f1536}', '{28}', 'e52c84bc-aa3c-485c-8145-08c91c2c6889', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (20, 'De Nederlandse Energie Maatschappij', 11, '{7705cabd-0d52-43c7-a101-9c3f03647b2b}', '{20}', '9bc4050e-2de0-4078-8057-6a3e42f84f5b', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (21, 'Eneco Consumenten B.V.', 12, '{639d9256-41b8-48a6-8791-9d6dcad23a26}', '{21}', '91b54209-98c4-4304-a841-bab7c9adb786', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (29, 'FBTO Zorgverzekeringen N.V.', 20, '{bb56485f-a633-4586-b37c-3f1b093c9e11}', '{29}', '5b84dc6d-78f6-41a8-8dc7-4a1d1726abbe', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (33, 'KPN B.V.', 24, '{b6b607a1-6989-4317-ada1-4bb6a9ea2413}', '{33}', '156847ac-8460-4cb9-a0ac-f3a860b88f86', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (30, 'Stichting Zorg en Zekerheid', 21, '{edeb5cc3-7f5e-4c40-9576-30de706da560}', '{30}', '38e5f7a1-d362-4bbc-85a1-1db2e15bf469', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (34, 'Vodafone Libertel B.V.', 25, '{90ef46b5-ef99-43b0-a3e7-20d4566405f7}', '{34}', 'b0b9648b-45ad-448e-b7f0-526aa804a4e4', NULL, NULL, NULL);


--
-- Name: afdelingen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hhb
--

SELECT pg_catalog.setval('public.afdelingen_id_seq', 34, true);


--
-- Name: organisaties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hhb
--

SELECT pg_catalog.setval('public.organisaties_id_seq', 25, true);


--
-- PostgreSQL database dump complete
--


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

INSERT INTO public.organisaties VALUES (1, '000023683899', 'Belastingdienst Toeslagen Kantoor Utrecht', '27365323', '8e136a76-7adb-487b-abaf-e9b4c0ceee91');
INSERT INTO public.organisaties VALUES (2, '000026319926', 'CAK', '56806787', '9645f0bb-42c7-483f-82f1-0e1de1c13c61');
INSERT INTO public.organisaties VALUES (3, '000000299391', 'Dienst Uitvoering Onderwijs', '50973029', '45ebb79e-1861-47da-9552-bdfdddaf71af');
INSERT INTO public.organisaties VALUES (4, '000005203368', 'Gemeente Utrecht', '30280353', '2d3bcab3-0a0d-4470-a078-32bef5d5f896');
INSERT INTO public.organisaties VALUES (5, '000007246382', 'Sociale Verzekeringsbank', '34366008', 'f4291154-63cf-41bb-87a0-78dc555a61f8');
INSERT INTO public.organisaties VALUES (6, '000010718842', 'UWV Utrecht', '34360247', 'e3a97f4c-9043-45a0-a64d-2d47dfd52519');
INSERT INTO public.organisaties VALUES (7, '000000000000', 'Stichting Vaste Lasten Pakket', '73834238', '9ebf190b-762e-40a4-9694-a7849d8ef1e1');
INSERT INTO public.organisaties VALUES (8, '000015447650', 'Vitens N.V.', '05069581', 'c90290dd-bd8c-44b6-b957-6b0c0cc75180');
INSERT INTO public.organisaties VALUES (9, '000000595233', 'Stichting Mitros', '30136131', '15b01ac6-19b0-4c5f-b024-80437164ade5');
INSERT INTO public.organisaties VALUES (10, '000002799669', 'Stichting Portaal', '30038487', 'c8b6f63f-f878-42db-9182-61bbac733ee4');
INSERT INTO public.organisaties VALUES (11, '000017772559', 'De Nederlandse Energie Maatschappij', '34297646', 'f27b6d2d-3215-484c-a32d-6a07447107bf');
INSERT INTO public.organisaties VALUES (12, '000016418557', 'Eneco Consumenten B.V.', '24324527', '039e2e00-69ba-4610-a976-bafd0ddaa1e1');
INSERT INTO public.organisaties VALUES (13, '000016985524', 'Energiedirect B.V.', '17146989', '115a0004-a380-42f4-bb35-292f3a6de20f');
INSERT INTO public.organisaties VALUES (14, '000020223862', 'ENGIE Nederland Retail B.V.', '05082820', '15a663e0-024d-41d7-bda8-c19024f0a29d');
INSERT INTO public.organisaties VALUES (15, '000016784626', 'Essent Retail Energie B.V.', '13041611', 'e9809569-6de0-417f-8a8c-08d06c162a73');
INSERT INTO public.organisaties VALUES (16, '000020842066', 'Anderzorg N.V.', '50544403', 'b23ea245-eaff-413b-81d1-a7bb38c665b3');
INSERT INTO public.organisaties VALUES (17, '000016548582', 'Co├╢peratie VGZ U.A.', '10029718', 'b2153691-ef20-4811-9f76-447ccd6cb23b');
INSERT INTO public.organisaties VALUES (18, '000004636074', 'CZ Groep Aanvullende Verzekering Zorgverzekeraar', '18028752', '3c14a3cc-810c-4094-869a-c9404016fd27');
INSERT INTO public.organisaties VALUES (19, '000018569463', 'DSW Ziektekostenverzekeringen N.V.', '24230430', 'b5921061-db2b-4891-b1d4-355638d8c2e5');
INSERT INTO public.organisaties VALUES (20, '000018994245', 'FBTO Zorgverzekeringen N.V.', '30208631', 'f229f89d-38e1-4d42-88c7-f4a3fd327c7b');
INSERT INTO public.organisaties VALUES (21, '000040446425', 'Stichting Zorg en Zekerheid', '41168265', '6b548260-03d0-4b5d-9bd5-1af520609b15');
INSERT INTO public.organisaties VALUES (22, '000037991752', 'RISK Direct B.V.', '69653852', 'c147ee99-b017-4e12-a66d-2762f4059af0');
INSERT INTO public.organisaties VALUES (23, '000018360785', 'Albert Heijn B.V.', '35012085', 'f90b0a24-6062-4f01-9159-971fd7b4983c');
INSERT INTO public.organisaties VALUES (24, '000016430921', 'KPN B.V.', '27124701', 'e9479aa7-9ebb-492d-89c1-04ab3255a1a2');
INSERT INTO public.organisaties VALUES (25, '000016160703', 'Vodafone Libertel B.V.', '14052264', 'ae3afb8c-a68c-4f58-8c65-1eded749e6d8');


--
-- Data for Name: afdelingen; Type: TABLE DATA; Schema: public; Owner: hhb
--

INSERT INTO public.afdelingen VALUES (12, 'UWV, afdeling WAZO/ZEZ (vanaf 1-7-2019)', 6, '{750b3a88-93dc-43f0-833e-d6a3f17e9dc0}', '{10,11,12,13}', 'a61f2fdf-e949-41fa-9525-5b5f5b55a158', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (1, 'Belastingdienst Toeslagen Kantoor Utrecht', 1, '{a87794d3-91af-40df-84a2-e976dc21c209}', '{1,2}', 'a92d9db0-8ac3-4dd8-991e-532aee09b883', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (2, 'CAK', 2, '{59cbdf4b-962a-42c8-90b0-5f1a254440a0}', '{3}', 'fd20cd50-80eb-4b9c-bc5e-48038ad79dc1', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (22, 'Energiedirect B.V.', 13, '{27b70e1c-989c-4d76-91fc-3174232da2bb}', '{22}', 'a8d76ef4-65c2-4148-a32d-b6c81d105ea8', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (3, 'Dienst Uitvoering Onderwijs', 3, '{c73ffee8-b250-4fa1-b292-68f94944bd21}', '{4}', 'b4020b3e-823e-4769-90f8-fa6ddf531bb1', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (23, 'ENGIE Nederland Retail B.V.', 14, '{c52ea47d-7db7-4494-a3be-4df4c6463121}', '{23}', '5221cfd1-1053-4dff-8975-75662f6009be', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (13, 'UWV, afdeling WIA', 6, '{0121d723-3b3b-408f-9c03-2bbc539680bd}', '{10,11,12,13}', 'c59f008c-b677-47d2-b904-5a4fa83de59d', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (4, 'Gemeente Utrecht', 4, '{3cdbd0a9-fee1-4528-8757-bb9ad1fd79aa}', '{5,6,7,8}', 'ffa8ecdd-01a7-427f-9bb8-06d879b4abca', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (5, 'Sociale Verzekeringsbank', 5, '{7a31148d-f13b-4252-a3ef-55dac8580b16}', '{9}', '839eb7be-9480-43cd-93ba-b11f3afdaf36', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (31, 'RISK Direct B.V.', 22, '{596e7185-6a6b-4e7a-97b1-7a9bed7429e1}', '{31}', '88c3c287-321e-4af3-8f45-d801382b3fce', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (24, 'Essent Retail Energie B.V.', 15, '{fd1a6203-8041-4dfa-b743-7b0bcfd46141}', '{24}', '7481d7f0-a921-4706-8cb5-5608bd23de2b', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (6, 'UWV, afdeling WW', 6, '{bf92d8ae-6e66-4436-909e-f69de3db125c}', '{10,11,12,13}', 'e511e501-efbd-49d5-be59-357926f8e646', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (14, 'UWV, afdeling IOW', 6, '{0a4d75d5-c949-4f86-b653-5a486720af63}', '{10,11,12,13}', '459ba953-78e9-438f-801f-bab32e81f0d1', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (25, 'Anderzorg N.V.', 16, '{36296f9a-9f31-45c9-8433-8d26f9aa2417}', '{25}', 'be0a81dd-54be-4416-b3f8-ada519b87f64', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (7, 'UWV, afdeling Wajong', 6, '{7a7a8031-77ec-4696-bfe6-02a70840caca}', '{10,11,12,13}', 'bb76be2b-ac60-4342-bc59-7577df1a8b9a', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (15, 'UWV, afdeling Beoordeling arbeidsvermogen', 6, '{ec629a94-9c66-4d4b-8178-bd97e146d38d}', '{10,11,12,13}', '58fdffdd-df2d-4d9b-ad10-27d03d285ef4', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (8, 'UWV, afdeling WAO', 6, '{0914e3e1-d923-4f6a-8db6-1e38721e597f}', '{10,11,12,13}', '83ee9c68-2aad-475c-b059-f3741f50bdbf', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (26, 'Co├╢peratie VGZ U.A.', 17, '{15cdfcc7-6932-4efb-8de6-841376ccd74b}', '{26}', '1cb3262b-bb49-4182-a49a-8741e22e6573', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (16, 'Stichting Vaste Lasten Pakket', 7, '{3d05c6eb-5bf8-4573-8ab5-1445049786bd}', '{14}', '8afb5b51-7902-4673-8c63-9aca7e84dfa4', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (9, 'UWV, afdeling WAZ', 6, '{56fa07f7-1468-4c43-ab7f-4d8b126f5d36}', '{10,11,12,13}', '9c5fb62f-67e1-4d40-85c9-87e9a5b0bbdd', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (17, 'Vitens N.V.', 8, '{838295a7-3583-400b-a046-66b14e92d7ed}', '{15}', '6ebd4194-26d6-4ce3-a1f7-807b3f5dc7bb', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (32, 'Albert Heijn B.V.', 23, '{362fa7ee-1707-48d7-be40-2e4f1141d7ea}', '{32}', '4aa47f11-22b5-4d00-a464-ec1b08f90e90', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (27, 'CZ Groep Aanvullende Verzekering Zorgverzekeraar', 18, '{8d32b97f-14d1-484f-b00d-7e3566a0bde9}', '{27}', 'b22801c4-1224-40c2-b1a2-59ecbd083327', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (10, 'UWV, afdeling ZW', 6, '{bd9a276c-8732-46f8-9127-b16b81ece130}', '{10,11,12,13}', '0667714c-d0da-4edd-92dd-56aa984c5812', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (18, 'Stichting Mitros', 9, '{886f12fa-737a-4b26-913b-de2fb7e29497}', '{16,17}', '6b512bee-b9dd-4513-a190-eba7971e122d', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (11, 'UWV, afdeling WAZO/ZEZ (tot 1-7-2019)', 6, '{90b28a3f-3078-4e4a-aa2c-80816ab057cc}', '{10,11,12,13}', '7385adf9-baa7-4831-ad68-def9240c1444', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (19, 'Stichting Portaal', 10, '{820a0e8a-8746-4a61-989a-9a7f11afd0a8}', '{18,19}', '2a31062b-fcc6-46bf-87a0-21a7cba57bbb', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (28, 'DSW Ziektekostenverzekeringen N.V.', 19, '{886e9021-8a27-42e5-aefe-90598cbbe520}', '{28}', '4f578ebf-3357-40e8-ad57-095566d30cab', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (20, 'De Nederlandse Energie Maatschappij', 11, '{41853c07-5a2e-407f-9531-809f144ab860}', '{20}', 'b4354b01-423d-4d0d-9f65-979c788a6cec', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (21, 'Eneco Consumenten B.V.', 12, '{b4ebd2ba-ccba-4edf-b967-1742a49c693f}', '{21}', '69385a51-5e9e-4a7c-9328-d9d653e9350c', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (29, 'FBTO Zorgverzekeringen N.V.', 20, '{f9dde557-df7d-43df-ac68-bda9e0590150}', '{29}', '26f18030-1a35-43a1-8ded-cd966f21614d', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (33, 'KPN B.V.', 24, '{120c1899-e4c0-46ea-a1e5-c8e89c8c8c63}', '{33}', '2613a832-fb1f-49be-bf0a-2e52fc90cc6d', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (30, 'Stichting Zorg en Zekerheid', 21, '{21c5111c-2c68-426d-85f2-f77fdc1777ef}', '{30}', '5aba8702-c583-4c5a-8fe3-eb9f0a8b1c88', NULL, NULL, NULL);
INSERT INTO public.afdelingen VALUES (34, 'Vodafone Libertel B.V.', 25, '{6391493a-7112-4337-9368-7a5b011a69af}', '{34}', '455fa75e-3f74-49cb-bc79-886d9f613e8d', NULL, NULL, NULL);



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


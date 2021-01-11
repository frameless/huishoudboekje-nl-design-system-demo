BEGIN;
\COPY organisaties (kvk_nummer,naam,straatnaam,huisnummer,postcode,plaatsnaam) FROM 'organisatieservice/organisaties.csv' (FORMAT csv, DELIMITER '|', HEADER true);
END;

module.exports = Object.freeze({
    // Profile Related Queries
    SelectProfileByUsernameAndPassword: 'SELECT * FROM profile WHERE username=$1 AND password=$2',
    SelectProfileByUsername: 'SELECT * FROM profile WHERE username=$1',
    SelectProfileByEmail: 'SELECT * FROM profile WHERE email=$1',
    InsertProfile: "INSERT INTO profile (username, password, email, role) VALUES ($1, $2, $3, 'Regular')",
    DeleteProfile: "DELETE FROM profile WHERE username=$1"

    // Category Related Queries

    // Thread Related Queries

    // Post Related Queries
});
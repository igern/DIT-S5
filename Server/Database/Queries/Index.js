module.exports = Object.freeze({
    // Profile Related Queries
    SelectProfileByUsernameAndPassword: 'SELECT * FROM profile WHERE brugernavn=$1 AND kodeord=$2',
    SelectProfileByUsername: 'SELECT * FROM profile WHERE brugernavn=$1',
    SelectProfileByEmail: 'SELECT * FROM profile WHERE email=$1',
    InsertProfile: 'INSERT INTO profile (brugernavn, kodeord, email) VALUES ($1, $2, $3)'

    // Category Related Queries

    // Thread Related Queries

    // Post Related Queries
});
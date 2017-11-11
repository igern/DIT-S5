module.exports = Object.freeze({
    // Profile Related Queries
    SelectProfileByUsernameAndPassword: 'SELECT * FROM profile WHERE username=$1 AND password=$2',
    SelectProfileByUsername: 'SELECT * FROM profile WHERE username=$1',
    SelectProfileByEmail: 'SELECT * FROM profile WHERE email=$1',
    UpdateProfile: "UPDATE profile SET username=$1, password=$2, avatar=$3 WHERE email=$4",
    InsertProfile: "INSERT INTO profile (username, password, email, role) VALUES ($1, $2, $3, 'regular')",
    DeleteProfile: "DELETE FROM profile WHERE email=$1",

    // Category Related Queries
    SelectCategoryByTitle: 'SELECT * FROM category WHERE title=$1',
    SelectAllCategories: 'SELECT * FROM category',
    SelectCategoryByID: 'SELECT * FROM category WHERE id=$1',
    UpdateCategory: 'UPDATE category SET title=$1, color=$2 WHERE id=$3',
    InsertCategory: 'INSERT INTO category (title, color) VALUES ($1, $2)',
    DeleteCategory: "DELETE FROM category WHERE id=$1",

    // Thread Related Queries
    SelectThreadsByRecentActivity: "SELECT * FROM thread ORDER BY updated DESC LIMIT 20",
    SelectThreadsByParentID: "SELECT * FROM thread WHERE parent=$1",
    SelectThreadByID: "SELECT * FROM thread WHERE id=$1",
    RefreshThread: 'UPDATE thread SET updated=NOW() WHERE id=$1',
    InsertThread: "INSERT INTO thread (title, created, updated, creator, parent) VALUES ($1, NOW(), NOW(), $2, $3)",
    DeleteThread: "DELETE FROM thread WHERE id=$1",

    // Post Related Queries
    SelectPostByID: "SELECT * FROM post WHERE id=$1",
    SelectAllPosts: "SELECT * FROM post WHERE parent=$1 ORDER BY created ASC",
    UpdatePost: "UPDATE post SET content=$1, edited=NOW() WHERE id=$2",
    InsertPost: "INSERT INTO post (created, edited, content, creator, parent) VALUES (NOW(), NOW(), $1, $2, $3)",
    DeletePost: "DELETE FROM post WHERE id=$1",
});
const db = require("../db");
const {
    NotFoundError, 
    BadRequestError, 
    UnauthorizedError
} = require("../expressError")

class Tag {
    static async createTag(name){
        // check for duplicates
        const duplicateCheck = await db.query(
            `SELECT name
            FROM tags
            WHERE name = $1`,
            [name]
        )
        
        if(duplicateCheck.rows[0]){
            throw new BadRequestError("That tag already exists!")
        } 

        try{
            const result = await db.query(
                `INSERT INTO tags
                (name)
                VALUES($1)
                RETURNING id, name`,
                [name]
            );
            const tag = result.rows[0];
            return tag;
        }catch(e){
            console.error("Database error:", e);
            throw new BadRequestError("Error Creating Tag")
        }
    }

    static async findAllTags(){
        const result = await db.query(
            `SELECT id, name
            FROM tags
            ORDER BY name`
        );
        const tags = result.rows;
        return tags;
    }
}

module.exports = Tag;
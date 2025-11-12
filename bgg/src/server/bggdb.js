import mysql from 'mysql2/promise'

const SQL_PING = "select 1"
const SQL_SELECT_GAME_BY_NAME = 'select gid, name from game where name like ? order by name'
const SQL_SELECT_GAME_BY_GID = 'select * from game where gid = ?'
const SQL_SELECT_COMMENT_BY_GID = 'select user, c_text, rating from comment where gid = ? order by rating desc'

export function BGGDatabase(username, password, host, port=3306) {
  this.username = username
  this.password = password
  this.host = host
  this.port = port
}

BGGDatabase.prototype.connect = function() {
  this.pool = mysql.createPool({
    host: this.host,
    port: this.port,
    user: this.username,
    password: this.password,
    database: 'bgg',
    connectionLimit: 3
  })
}

BGGDatabase.prototype.findGamesByName = async function(name) {
  const searchTerm = `%${name}%`
  const result = await this.pool.query(SQL_SELECT_GAME_BY_NAME, [ searchTerm ])
  return result[0]
}

BGGDatabase.prototype.findGameByGameId = async function(gid) {
  const result = await this.pool.query(SQL_SELECT_GAME_BY_GID, [ gid ])
  if (!!result[0].length)
    return result[0][0]
  return null
}

BGGDatabase.prototype.findCommentsByGameId = async function(gid) {
  const result = await this.pool.query(SQL_SELECT_COMMENT_BY_GID, [ gid ])
  return result[0]
}


BGGDatabase.prototype.ping = async function() {
  await this.pool.query(SQL_PING)
  return true
}

BGGDatabase.prototype.disconnect = function() {
  return this.pool.end()
}



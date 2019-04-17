
/**
 * @swagger
 * /api/users:
 *    get:
 *      tags:
 *        - Users
 *      description: This should return all users
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        200:
 *          description: all users are retrieved.
 *          schema:
 *            type: array
 *            items: 
 *             $ref: "#/definitions/users"
 *        404:
 *         description: user not found
 *         schema:
 *           $ref: "#/definitions/error-message"
 *        400:
 *         description: Bad Request
 *         schema:
 *           $ref: "#/definitions/error-message"
 *        401:
 *          description: Bad Request
 *          schema:
 *            $ref: "#/definitions/error-message"
 * 
 * /api/users/{id}:
 *    get:
 *      tags:
 *        - Users
 *      description: This should return all users
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: User Id
 *          description: Id for user
 *          schema:
 *            type: string
 *          required: true
 * 
 *      responses:
 *        200:
 *          description: single user is retrieved.
 *          schema:
 *            $ref: "#/definitions/users"
 *        404:
 *         description: user not found
 *         schema:
 *           $ref: "#/definitions/error-message"
 *        400:
 *         description: Bad Request
 *         schema:
 *           $ref: "#/definitions/error-message"
 *        401:
 *         description: Bad Request
 *         schema:
 *           $ref: "#/definitions/error-message"
 * 
 * definitions:
 *  users:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *      name:
 *        type: object
 *        properties:
 *          firstName:
 *            type: string
 *            minLength: 3
 *            maxLength: 255
 *          lastName:
 *            type: string
 *            minLength: 3
 *            maxLength: 255
 *        required:
 *          - firstName
 *          - lastName
 *      username:
 *        type: string
 *      email:
 *        type: string
 *        format: email
 *      password:
 *        type: string
 *        writeOnly: true
 *      roleId:
 *        type: string
 *        pattern: '^[a-fA-F0-9]{24}$'
 *      createdAt:
 *        type: string
 *        format: date-time
 *      modifiedAt: 
 *        type: string
 *        format: date-time
 *    required:
 *      - username
 *      - email
 *      - name
 *      - roleId
 *      - password
 *      - createdAt
 * 
 *  error-message:
 *    type: object
 *    properties:
 *      Error:
 *        type: integer
 *        example: 404
 *      message:
 *        type: string
 *        example: Error message
 * 
 *  success-message:
 *    type: object
 *    properties:
 *      Success:
 *        type: integer
 *        example: 404
 *      message:
 *        type: string
 *        example: Error message

 * 
 */

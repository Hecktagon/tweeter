import { DAOFactory } from "../model/dao/interfaces/DAOFactory";
import { DynamoFactory } from "../model/dao/dynamodb/DynamoFactory";

export class DAOFactoryConfig {
    public static getDAOFactory(): DAOFactory {
        return new DynamoFactory();
    }
}
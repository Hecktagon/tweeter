import { DAOFactory } from "../model/dao/interfaces/DAOFactory";
import { DynamoFactory } from "../model/dao/dynamodb/DynamoFactory";

export class DAOFactoryConfig {
  private static instance: DAOFactory | null = null;

  public static getDAOFactory(): DAOFactory {
    if (!DAOFactoryConfig.instance) {
      DAOFactoryConfig.instance = new DynamoFactory();
    }
    return DAOFactoryConfig.instance;
  }
}
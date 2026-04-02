import { DAOFactory } from "../model/dao/DAOFactory";

export class DAOFactoryConfig {

    public static getDAOFactory(): DAOFactory {
        return {} as DAOFactory; // Change this line to switch the database
    }
}
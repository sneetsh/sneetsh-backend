import { Injectable } from "@nestjs/common";
import { BaseEntity } from "typeorm";

@Injectable()
export class BaseRepository extends BaseEntity {
    constructor() {
        super()
    }
}

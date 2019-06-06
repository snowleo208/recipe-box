export class Recipe {
  public id?: string;
  public title: string;
  public cook: string;
  public prep: string;
  public serve: string;
  public ingredients: object;
  public instructions: object;
  public image: string;
  public like?: string[];
  public public: boolean;
  public uid: string;
  public createdAt?: string;
  public updatedAt?: string;
}

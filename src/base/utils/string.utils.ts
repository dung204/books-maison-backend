export class StringUtils {
  public static snakeToCamel(snakeStr: string) {
    return snakeStr.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
  }

  public static camelToSnake(camelStr: string) {
    return camelStr.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }
}

//array type: number[]
//tuple type:

export const CheckDate = (inputTime: number, hours: number): boolean => {
  return Date.now() - inputTime < hours * 3600 * 1000; // within 2 hours
};

// export const CheckDate = (dateString: string): boolean => {
//   const splited: string[] = dateString.split(' ');
//   // Thu Sep 30 2021 21:14:27 GMT+1000 (Australian Eastern Standard Time) =>
//   // [ 'Thu,', '30', 'Sep', '2021', '11:14:27', 'GMT' ]
//   // Date.UTC(year, month, day, hour, minute, second)

//   const months = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sep',
//     'Oct',
//     'Nov',
//     'Dec',
//   ];
//   const hourMinuteSecond: number[] = splited[4]
//     .split(':')
//     .map((t) => parseInt(t));
//   const dateTime = new Date(
//     Date.UTC(
//       parseInt(splited[3]),
//       months.indexOf(splited[2]),
//       parseInt(splited[1]),
//       hourMinuteSecond[0],
//       hourMinuteSecond[1],
//       hourMinuteSecond[2]
//     )
//   ).getTime();
//   const nowTime = Date.now();
//   console.log(dateTime);
//   console.log(nowTime);
//   return nowTime - dateTime < 2 * 3600 * 1000; // within 2 hours
// };

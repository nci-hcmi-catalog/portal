import { BaseSvg } from 'icons';

export default ({ fill = 'currentColor', height = '12px', width = '12px', ...props }) =>
  BaseSvg({
    alt: 'DNA Icon',
    height,
    width,
    svg: `<svg  width="${width}" height="${height}" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path fill="${fill}" d="m14.901 3.89c.067.07.102.163.099.259-.004.096-.045.186-.116.251-.842.783-1.962.995-2.926.995-.238 0-.476-.014-.712-.038-.133-.005-.252-.083-.31-.204-.057-.12-.043-.262.037-.368.08-.107.213-.16.344-.138.405.043.813.043 1.217 0l-1.584-1.584c-.14-.14-.14-.369 0-.51.141-.14.37-.14.51 0l1.91 1.913c.38-.123.727-.326 1.021-.594.07-.067.163-.103.26-.1.095.004.186.046.25.118zm-4.283 1.204c.01.004.014.015.01.024-.003.01-.012.016-.022.014.04.125.834 2.732-.934 4.492h-.015c-.798.746-1.86 1.147-2.952 1.115-.251 0-.503-.016-.752-.051-.132-.011-.247-.094-.299-.215-.052-.122-.033-.262.05-.365s.216-.152.346-.127c.35.046.704.053 1.056.02l-1.551-1.55c-.14-.141-.14-.37 0-.51.14-.141.37-.141.51 0l1.888 1.897c.339-.11.656-.277.939-.494l-3.317-3.317c-1.132 1.44-.546 3.388-.51 3.5.066.197 1.117 3.39-.632 5.247-.067.071-.159.112-.256.113-.094.002-.185-.033-.255-.097-.07-.065-.112-.156-.115-.252-.002-.096.033-.19.1-.258 1.474-1.567.477-4.5.477-4.528-.04-.13-.829-2.735.936-4.49.466-.46 1.042-.792 1.674-.964.035-.017.073-.028.112-.033.638-.153 1.3-.184 1.949-.092.132.01.246.094.299.215.052.122.032.262-.05.365-.083.103-.216.152-.346.127-.357-.05-.718-.058-1.077-.026l1.551 1.556c.07.067.109.159.109.255s-.04.188-.109.255c-.067.069-.159.107-.255.105-.095 0-.187-.037-.255-.105l-1.888-1.9c-.343.114-.664.286-.948.51l3.316 3.316c1.168-1.441.576-3.408.54-3.523-.066-.188-1.12-3.39.643-5.247.14-.11.34-.1.468.024.128.123.147.322.042.466-1.476 1.566-.477 4.5-.477 4.528zm-6.854 6.76-.005-.003c.091.091.127.224.093.349-.033.124-.13.221-.255.255-.124.033-.257-.003-.348-.094l-1.867-1.87c-.283.126-.542.298-.766.51-.07.069-.166.105-.265.1-.098-.006-.19-.052-.252-.127-.067-.07-.102-.163-.099-.26.004-.095.045-.186.116-.25.354-.324.771-.57 1.225-.725.775-.251 1.596-.33 2.405-.23.134.004.254.082.312.202.059.12.045.263-.035.37s-.214.16-.346.138c-.5-.053-1.007-.04-1.505.04z" fill-rule="evenodd"/></svg>`,
    ...props,
  });

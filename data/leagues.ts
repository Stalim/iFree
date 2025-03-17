export interface League {
  id: string;
  name: string;
  logoUrl: string;
  country?: string;
}

export const leagues: League[] = [
  {
    id: 'fms_internacional',
    name: 'FMS Internacional',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Fms_logo.png',
  },
  {
    id: 'fms_espana',
    name: 'FMS España',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Fmsespa%C3%B1alogo.png/600px-Fmsespa%C3%B1alogo.png?20231227225636',
  },
  {
    id: 'fms_argentina',
    name: 'FMS Argentina',
    logoUrl: 'https://ih1.redbubble.net/image.5001824759.0292/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.webp',
  },
  {
    id: 'fms_caribe',
    name: 'FMS Caribe',
    logoUrl: 'https://static.wikia.nocookie.net/rap/images/7/76/FMS_Caribe_7.jpg/revision/latest/scale-to-width-down/1000?cb=20230214215010&path-prefix=es',
  },
  {
    id: 'fms_chile',
    name: 'FMS Chile',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9kFAsvEByxKy1KGfBlJZdX4sjHv0-D7kSeQ&s',
  },
  {
    id: 'fms_peru',
    name: 'FMS Peru',
    logoUrl: 'https://ih1.redbubble.net/image.1919052028.6586/st,small,507x507-pad,600x600,f8f8f8.jpg',
  },
  {
    id: 'fms_colombia',
    name: 'FMS Colombia',
    logoUrl: 'https://api.freestylestats.com/assets/26250900-7f73-4a3a-8804-27f84422bd54?width=180&height=180&format=auto',
  },
  {
    id: 'fms_mexico',
    name: 'FMS Mexico',
    logoUrl: 'https://yt3.googleusercontent.com/H8hMUobfXkE8c1Zh9L_5Cp69TGAWlwSodGYxUpvHXv1iSjHjzfgKYU1CljIA3a2LRl-yKr7y=s160-c-k-c0x00ffffff-no-rj',
  },
  {
    id: 'redbull_internacional',
    name: 'Red Bull Internacional',
    logoUrl: 'https://img.redbull.com/images/e_trim:10:transparent/c_limit,w_309/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/2/19/lzbbsuqgc7e7fsxqa9cf/logo-red-bull-batalla',
    country: 'España',
  },
  {
    id: 'rne',
    name: 'Red Bull Nacional',
    logoUrl: 'https://img.redbull.com/images/e_trim:10:transparent/c_limit,w_309/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/2/19/lzbbsuqgc7e7fsxqa9cf/logo-red-bull-batalla',
    country: 'España',
  },
  {
    id: 'rna',
    name: 'Red Bull Nacional',
    logoUrl: 'https://img.redbull.com/images/e_trim:10:transparent/c_limit,w_309/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/2/19/lzbbsuqgc7e7fsxqa9cf/logo-red-bull-batalla',
    country: 'Argentina',
  },
  {
    id: 'rnch',
    name: 'Red Bull Nacional',
    logoUrl: 'https://img.redbull.com/images/e_trim:10:transparent/c_limit,w_309/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/2/19/lzbbsuqgc7e7fsxqa9cf/logo-red-bull-batalla',
    country: 'Chile',
  },
  {
    id: 'rnp',
    name: 'Red Bull Nacional',
    logoUrl: 'https://img.redbull.com/images/e_trim:10:transparent/c_limit,w_309/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/2/19/lzbbsuqgc7e7fsxqa9cf/logo-red-bull-batalla',
    country: 'Peru',
  },
  {
    id: 'rnc',
    name: 'Red Bull Nacional',
    logoUrl: 'https://img.redbull.com/images/e_trim:10:transparent/c_limit,w_309/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/2/19/lzbbsuqgc7e7fsxqa9cf/logo-red-bull-batalla',
    country: 'Colombia',
  },
  {
    id: 'rnm',
    name: 'Red Bull Nacional',
    logoUrl: 'https://img.redbull.com/images/e_trim:10:transparent/c_limit,w_309/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/2/19/lzbbsuqgc7e7fsxqa9cf/logo-red-bull-batalla',
    country: 'Mexico',
  }
]; 
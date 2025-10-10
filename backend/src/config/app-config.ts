import multer, {Multer} from "multer";

export let multerStorage:multer.Multer;

export const MulterInit = () => {
  const multerMemoryStorage = multer.memoryStorage();
  multerStorage = multer({ storage: multerMemoryStorage });
};


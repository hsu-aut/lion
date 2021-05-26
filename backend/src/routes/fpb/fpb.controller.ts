import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller("/lion_BE/fpb")
export class FpbController {

  @Get()
  getClassName() {
	const a = 2
  }

  @Get(':id')
  getSomething(@Param('id') id: string):  {
	
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
		var form = new IncomingForm()
    form.maxFileSize = 350 * 1024 * 1024;
    form.uploadDir = fpbUtil.uploadDir;
    console.log(form.uploadDir)

    form.on('file', (field, file) => {
        fs.renameSync(file.path, fpbUtil.uploadDir + "/" + file.name)
    })
    form.on('end', () => {
        res.status(200).json('Added file')
    })
    form.parse(req)  
}

  @Post()
  createClassName_singular(@Body() className_singular: ClassName_singularDto) {
	this.classNameService.createClassName_singular(className_singular);
  }

  @Put()
  updateClassName_singular(@Body() className_singular: ClassName_singularDto) {
	this.classNameService.updateClassName_singular(className_singular);
  }

  /**
	* Delete className_singular
	* @param id
	*/
  @Delete()
  deleteClassName_singular(@Param('id') id: string) {
	this.classNameService.deleteClassName_singular(id);
  }

}

import ***REMOVED***ImageService***REMOVED*** from "../api-connector/image.service";
import ***REMOVED***Component, Input, ViewChild***REMOVED*** from '@angular/core';

@Component(***REMOVED***
    templateUrl: 'imageTag.component.html',
    providers: [ImageService]
***REMOVED***)
export class ImageTagComponent ***REMOVED***

    imageTags: [string, string][]


    constructor(private imageService: ImageService,) ***REMOVED***
        this.imageService.getImageTags().subscribe(result => ***REMOVED***
            this.imageTags = result;
        ***REMOVED***)
    ***REMOVED***

    addTag(tag: string, description: string)***REMOVED***
        this.imageService.addImageTags(tag,description).subscribe(result =>***REMOVED***
            this.imageService.getImageTags().subscribe(result=>***REMOVED***
                this.imageTags=result
            ***REMOVED***)
        ***REMOVED***)
    ***REMOVED***

        deleteTag(tag: string)***REMOVED***
        this.imageService.deleteImageTag(tag).subscribe(result =>***REMOVED***
            this.imageService.getImageTags().subscribe(result=>***REMOVED***
                this.imageTags=result
            ***REMOVED***)
        ***REMOVED***)
    ***REMOVED***



***REMOVED***

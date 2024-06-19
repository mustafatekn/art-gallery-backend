import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard.ts';
import { UserToken } from 'src/auth/types/user-token';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    getPosts() {
        return this.postService.getPosts();
    }

    @Get(':url')
    @HttpCode(HttpStatus.OK)
    getPost(@Param('url') url: string) {
        return this.postService.getPostByUrl(url);
    }

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() createPostDto: CreatePostDto, @User() user: UserToken) {
        return this.postService.createPost(createPostDto, user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    deletePost(@Param('id') id: string) {
        return this.postService.deletePost(id);
    }
}

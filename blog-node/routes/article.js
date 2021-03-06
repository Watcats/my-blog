import Article from '../models/article';
import User from '../models/user';
import Tag from '../models/tag';
import { responseClient, timestampToTime } from '../util/util';

exports.addArticle = async (req, res) => {
  const {
    title,
    keyword,
    author,
    desc,
    content,
    // img_url,
    type,
    state,
    tags,
    origin,
    // category,
  } = req.body;
  //数据库中存的是另一个文档对象的ObjectId,也就是_id字段,要将string转换成_id
  let tag_arr = tags ? tags.split(',') : [];
  let tags_id = [];
  for (let i = 0; i < tag_arr.length; i++) {
    await Tag.findOne({
      name: tag_arr[i],
    })
      .then(result => {
        if (result) {
          tags_id.push(result._id)
        } else {//没有这个tag就新建一个
          let tag_new = new Tag({
            name: tag_arr[i],
            desc: '',
          });
          tag_new.save().then(data => {
            tags_id.push(data._id);
          })
        }
      })
  }
  let tempArticle = null;
  // if (img_url) //暂时不做文章封面，所有与图片有关的需要上线后再测试
  tempArticle = new Article({
    title: title,
    keyword: keyword ? keyword.split(',') : [],
    author: author,
    desc: desc,
    content: content,
    numbers: content.length,
    type: type,
    state: state,
    // img_url,
    tags: tags_id,
    // category: category ? category.split(',') : [],
    origin: origin,
  });

  tempArticle
    .save()
    .then(data => {
      // let article = JSON.parse(JSON.stringify(data));
      // console.log('article :', article);
      // article.create_time = timestampToTime(article.create_time);
      // article.update_time = timestampToTime(article.update_time);
      // console.log('timestampToTime :', timestampToTime(data.create_time));
      responseClient(res, 200, 0, '保存成功', data);
    })
    .catch(err => {
      console.log(err);
      responseClient(res);
    });
};

exports.updateArticle = async (req, res) => {
  // if (!req.session.userInfo) {
  // 	responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
  // 	return;
  // }
  const {
    id,//这个id是数据库自动生成的id
    title,
    keyword,
    author,
    desc,
    content,
    // img_url,
    type,
    state,
    tags,
    origin,
    // category,
  } = req.body;
  let tag_arr = tags ? tags.split(',') : [];
  // console.log("tag_arr: "+tag_arr);
  let tags_id = [];
  for (let i = 0; i < tag_arr.length; i++) {
    await Tag.findOne({
      name: tag_arr[i],
    })
      .then(result => {
        if (result) {
          tags_id.push(result._id)
        } else {//没有这个tag就新建一个
          let tag_new = new Tag({
            name: tag_arr[i],
            desc: '',
          });
          tag_new.save().then(result => {
            tags_id.push(result._id);
          })
        }
      })
  }
  // Article.update(
  Article.updateOne(
    { _id: id },
    {
      title: title,
      keyword: keyword ? keyword.split(',') : [],
      desc: desc,
      content: content,
      numbers: content.length,
      // img_url,
      tags: tags_id,
      // category: category ? category.split(',') : [],
    },
  )
    .then(result => {
      responseClient(res, 200, 0, '操作成功', result);
    })
    .catch(err => {
      console.error(err);
      responseClient(res);
    });
};

exports.delArticle = (req, res) => {
  let { id } = req.body;
  Article.deleteMany({ _id: id })
    .then(result => {
      if (result.n === 1) {
        responseClient(res, 200, 0, '删除成功!');
      } else {
        responseClient(res, 200, 1, '文章不存在');
      }
    })
    .catch(err => {
      console.error('err :', err);
      responseClient(res);
    });
};

// 前台文章列表
exports.getArticleList = (req, res) => {
  // console.log(req.query);
  let author = req.body.user || null;
  let keyword = req.query.keyword || null;
  let state = req.query.state || '';
  let likes = req.query.likes || '';
  let tag_id = req.query.tag_id || '';
  // let category_id = req.query.category_id || '';
  // let article = req.query.article || '';//所有文章
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;

  // 如果是文章归档 返回全部文章
  // if (article) {
  //   pageSize = 1000;
  // }

  let conditions = { type: 1 };
  if (!author) {
    if (keyword) {
      const reg = new RegExp(keyword, 'i'); //不区分大小写
      conditions = {
        $and: [
          { type: 1 },
          {
            $or: [
              { title: { $regex: reg } },
              { keyword: { $regex: reg } },
              { desc: { $regex: reg } },
              { content: { $regex: reg } }
            ],
          }
        ]
      };
    }
  } else if (author) {
    // state = parseInt(state);
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      conditions = {
        $and: [
          { type: 1 },
          { $or: [{ author: author }] },
          {
            $or: [
              { title: { $regex: reg } },
              { desc: { $regex: reg } },
              { keyword: { $regex: reg } },
              { content: { $regex: reg } }
            ],
          },
        ],
      };
    } else {
      conditions = { author: author, type: 1 };
    }
  }

  let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
  let responseData = {
    count: 0,
    list: [],
  };
  Article.countDocuments({}, (err, count) => {
    if (err) {
      console.log('Error:' + err);
    } else {
      responseData.count = count;
      // 待返回的字段
      let fields = {
        title: 1,
        desc: 1,
        // img_url: 1,
        tags: 1,
        // category: 1,
        meta: 1,
        create_time: 1,
      };
      // if (article) {
      //   fields = {
      //     title: 1,
      //     create_time: 1,
      //   };
      // }
      let options = {
        skip: skip,
        limit: pageSize,
        sort: { create_time: -1 },
      };
      Article.find(conditions, fields, options, (error, result) => {
        if (err) {
          console.error('Error:' + error);
          // throw error;
        } else {
          let newList = [];
          if (likes) {
            // 根据热度 likes 返回数据
            result.sort((a, b) => {
              return b.meta.likes - a.meta.likes;
            });
            responseData.list = result;
          }
          // else if (category_id) {
          //   // console.log('category_id :', category_id);
          //   // 根据 分类 id 返回数据
          //   result.forEach(item => {
          //     if (item.category.indexOf(category_id) > -1) {
          //       newList.push(item);
          //     }
          //   });
          //   let len = newList.length;
          //   responseData.count = len;
          //   responseData.list = newList;
          // } 
          else if (tag_id) {
            // console.log('tag_id :', tag_id);
            // 根据标签 id 返回数据
            result.forEach(item => {
              if (item.tags.indexOf(tag_id) > -1) {
                newList.push(item);
              }
            });
            let len = newList.length;
            responseData.count = len;
            responseData.list = newList;
          }
          // else if (article) {
          //   const archiveList = []
          //   let obj = {}
          //   // 按年份归档 文章数组
          //   result.forEach((e) => {
          //     let year = e.create_time.getFullYear()
          //     // let month = e.create_time.getMonth()
          //     if (!obj[year]) {
          //       obj[year] = []
          //       obj[year].push(e)
          //     } else {
          //       obj[year].push(e)
          //     }
          //   })
          //   for (const key in obj) {
          //     if (obj.hasOwnProperty(key)) {
          //       const element = obj[key];
          //       let item = {}
          //       item.year = key
          //       item.list = element
          //       archiveList.push(item)
          //     }
          //   }
          //   archiveList.sort((a, b) => {
          //     return b.year - a.year;
          //   });
          //   responseData.list = archiveList;
          // }
          else {
            responseData.list = result;
          }
          responseClient(res, 200, 0, '操作成功！', responseData);
        }
      });
    }
  });
};

// 后台文章列表
// exports.getArticleListAdmin = (req, res) => {
//   let keyword = req.query.keyword || null;
//   let state = req.query.state || '';
//   let likes = req.query.likes || '';
//   let pageNum = parseInt(req.query.pageNum) || 1;
//   let pageSize = parseInt(req.query.pageSize) || 10;
//   let conditions = {};
//   if (!state) {
//     if (keyword) {
//       const reg = new RegExp(keyword, 'i'); //不区分大小写
//       conditions = {
//         $or: [{ title: { $regex: reg } }, { desc: { $regex: reg } }],
//       };
//     }
//   } else if (state) {
//     state = parseInt(state);
//     if (keyword) {
//       const reg = new RegExp(keyword, 'i');
//       conditions = {
//         $and: [
//           { $or: [{ state: state }] },
//           {
//             $or: [
//               { title: { $regex: reg } },
//               { desc: { $regex: reg } },
//               { keyword: { $regex: reg } },
//             ],
//           },
//         ],
//       };
//     } else {
//       conditions = { state };
//     }
//   }

//   let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
//   let responseData = {
//     count: 0,
//     list: [],
//   };
//   Article.countDocuments({}, (err, count) => {
//     if (err) {
//       console.log('Error:' + err);
//     } else {
//       responseData.count = count;
//       // 待返回的字段
//       let fields = {
//         title: 1,
//         author: 1,
//         keyword: 1,
//         // content: 1,
//         desc: 1,
//         img_url: 1,
//         tags: 1,
//         category: 1,
//         state: 1,
//         type: 1,
//         origin: 1,
//         comments: 1,
//         like_User_id: 1,
//         meta: 1,
//         create_time: 1,
//         // update_time: 1,
//       };
//       let options = {
//         skip: skip,
//         limit: pageSize,
//         sort: { create_time: -1 },
//       };
//       Article.find(conditions, fields, options, (error, result) => {
//         if (err) {
//           console.error('Error:' + error);
//           // throw error;
//         } else {
//           if (likes) {
//             result.sort((a, b) => {
//               return b.meta.likes - a.meta.likes;
//             });
//           }
//           responseData.list = result;
//           responseClient(res, 200, 0, '操作成功！', responseData);
//         }
//       })
//         .populate([
//           { path: 'tags' },
//           { path: 'comments' },
//           { path: 'category' },
//         ])
//         .exec((err, doc) => {
//           // console.log("doc:");          // aikin
//           // console.log("doc.tags:",doc.tags);          // aikin
//           // console.log("doc.category:",doc.category);           // undefined
//         });
//     }
//   });
// };

// 文章点赞
exports.likeArticle = (req, res) => {
  if (!req.session.userInfo) {
    responseClient(res, 200, 1, '您还没登录,或者登录信息已过期，请重新登录！');
    return;
  }
  let { id, user_id } = req.body;
  Article.findOne({ _id: id })
    .then(data => {
      let fields = {};
      data.meta.likes = data.meta.likes + 1;
      fields.meta = data.meta;
      let like_users_arr = data.like_users.length ? data.like_users : [];
      User.findOne({ _id: user_id })
        .then(user => {
          let new_like_user = {};
          new_like_user.id = user._id;
          new_like_user.name = user.name;
          // new_like_user.avatar = user.avatar;
          // new_like_user.create_time = user.create_time;
          new_like_user.type = user.type;
          // new_like_user.introduce = user.introduce;
          like_users_arr.push(new_like_user);
          fields.like_users = like_users_arr;
          // Article.update({ _id: id }, fields)
          Article.updateOne({ _id: id }, fields)
            .then(result => {
              responseClient(res, 200, 0, '操作成功！', result);
            })
            .catch(err => {
              console.error('err :', err);
              throw err;
            });
        })
        .catch(err => {
          responseClient(res);
          console.error('err 1:', err);
        });
    })
    .catch(err => {
      responseClient(res);
      console.error('err 2:', err);
    });
};

// 获取网页介绍，现在已经被整合到获取文章详情里面了
exports.getArticleDetailByType = (req, res) => {
  let { type } = req.body;
  if (!type) {
    responseClient(res, 200, 1, '文章不存在 ！');
    return;
  }
  Article.findOne({ type: type }, (Error, data) => {
    if (Error) {
      console.error('Error:' + Error);
      // throw error;
    } else {
      data.meta.views = data.meta.views + 1;
      Article.updateOne({ type: type }, { meta: data.meta })
        .then(result => {
          responseClient(res, 200, 0, '操作成功 ！', data);
        })
        .catch(err => {
          console.error('err :', err);
          throw err;
        });
    }
  })
    .populate([
      { path: 'tags', select: '-_id' },
      { path: 'category', select: '-_id' },
      { path: 'comments', select: '-_id' },
    ])
    .exec((err, doc) => {
      // console.log("doc:");          // aikin
      // console.log("doc.tags:",doc.tags);          // aikin
      // console.log("doc.category:",doc.category);           // undefined
    });
};

// 文章详情
exports.getArticleDetail = (req, res) => {
  let { id } = req.body;
  // console.log(req.body);
  let type = Number(req.body.type) || 1; //文章类型 => 1: 普通文章，2: 其他
  let filter = Number(req.body.filter) || 1; //文章的评论过滤 => 1: 过滤，2: 不过滤
  // console.log('type:', type);
  if (type === 1) {
    if (!id) {
      responseClient(res, 200, 1, '文章不存在 ！');
      return;
    }
    Article.findOne({ _id: id }, (Error, data) => {
      if (Error) {
        console.error('Error:' + Error);
        // throw error;
      } else {
        data.meta.views = data.meta.views + 1;
        Article.updateOne({ _id: id }, { meta: data.meta })
          .then(result => {
            // console.log('data:',data)
            //过滤未审核的评论，现在暂时没用
            // if (filter === 1) {
            //   const arr = data.comments;
            //   for (let i = arr.length - 1; i >= 0; i--) {
            //     const e = arr[i];
            //     if (e.state !== 1) {
            //       arr.splice(i, 1);
            //     }
            //     const newArr = e.other_comments;
            //     const length = newArr.length;
            //     if (length) {
            //       for (let j = length - 1; j >= 0; j--) {
            //         const item = newArr[j];
            //         if (item.state !== 1) {
            //           newArr.splice(j, 1);
            //         }
            //       }
            //     }
            //   }
            // }
          })
          .catch(err => {
            console.error('err :', err);
            throw err;
          });
      }
    })
      .populate([{ path: 'tags' },
      // { path: 'category' },
      { path: 'comments' }])
      // .exec((err, doc) => {
      //   // console.log("doc:");          // aikin
      //   // console.log("doc.tags:",doc.tags);          // aikin
      //   // console.log("doc.category:",doc.category);           // undefined

      // })
      .then(result => {
        responseClient(res, 200, 0, '操作成功 ！', result);

      })
  } else {//网站介绍，一般只有一篇
    Article.findOne({ type: type }, (Error, data) => {
      if (Error) {
        console.log('Error:' + Error);
        // throw error;
      } else {
        if (data) {
          data.meta.views = data.meta.views + 1;
          Article.updateOne({ type: type }, { meta: data.meta })
            .then(result => {
              // if (filter === 1) {
              //   const arr = data.comments;
              //   for (let i = arr.length - 1; i >= 0; i--) {
              //     const e = arr[i];
              //     if (e.state !== 1) {
              //       arr.splice(i, 1);
              //     }
              //     const newArr = e.other_comments;
              //     const length = newArr.length;
              //     if (length) {
              //       for (let j = length - 1; j >= 0; j--) {
              //         const item = newArr[j];
              //         if (item.state !== 1) {
              //           newArr.splice(j, 1);
              //         }
              //       }
              //     }
              //   }
              // }
            })
            .catch(err => {
              console.error('err :', err);
              throw err;
            });
        } else {
          responseClient(res, 200, 1, '文章不存在 ！');
          return;
        }
      }
    })
      .populate([{ path: 'tags' },
      //  { path: 'category' }, 
      { path: 'comments' }])
      // .exec((err, doc) => {
      //   // console.log("doc:");          // aikin
      //   // console.log("doc.tags:",doc.tags);          // aikin
      //   // console.log("doc.category:",doc.category);           // undefined
      // });
      .then(result => {
        responseClient(res, 200, 0, '操作成功 ！', result);

      })
  }
};

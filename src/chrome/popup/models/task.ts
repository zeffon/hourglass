/*
 * @Description: 任务模型
 * @Author: Zeffon
 * @Date: 2021-11-09 06:05:22
 * @LastEditors: Zeffon
 * @LastEditTime: 2021-11-09 07:40:22
 */
import storage from 'good-storage'

export interface TaskModel {
  id: number
  name: string
  time: number
  level: string
  end_time?: string
  status: number
}

export class Task {
  private static instance: Task
  static STORAGE_KEY = 'task'
  _taskData = {
    items: []
  }

  constructor() {
    if (typeof Task.instance === 'object') {
      return Task.instance
    }
    Task.instance = this
    return this
  }

  getAllTaskFromLocal() {
    return this._getTaskData()
  }

  // async getAllTaskFromServer() {}

  clear() {
    const taskData = this._getTaskData()
    for (let i = 0; i < taskData.items.length; i++) {
      if (taskData.items[i].checked) {
        taskData.items.splice(i, 1)
      }
    }
    this._refreshStorage()
  }

  addItem(newItem: TaskModel) {
    debugger
    this._pushItem(newItem)
    this._refreshStorage()
  }

  removeItem(id: number) {
    const oldItemIndex = this._findEqualItemIndex(id)
    const taskData = this._getTaskData()
    taskData.items.splice(oldItemIndex, 1)
    this._refreshStorage()
  }

  isEmpty() {
    const taskData = this._getTaskData()
    return taskData.items.length === 0
  }

  _findEqualItemIndex(id: number) {
    const taskData = this._getTaskData()
    return taskData.items.findIndex((item: TaskModel) => {
      return item.id === id
    })
  }

  _getTaskData() {
    debugger
    if (this._taskData.items.length !== 0) {
      return this._taskData
    }
    let taskData = storage.get(Task.STORAGE_KEY)
    if (!taskData) {
      taskData = this._initTaskDataStorage()
    }
    return taskData
  }

  _initTaskDataStorage() {
    const taskData = {
      items: []
    }
    storage.set(Task.STORAGE_KEY, taskData)
    return taskData
  }

  _refreshStorage() {
    storage.set(Task.STORAGE_KEY, this._taskData)
  }

  _pushItem(newItem: TaskModel) {
    const taskData = this._getTaskData()
    const items = taskData.items
    items.unshift(newItem)
  }

  findEqualItem(id: number) {
    let oldItem = null
    const items = this._getTaskData().items
    for (let i = 0; i < items.length; i++) {
      if (this._isEqualItem(items[i], id)) {
        oldItem = items[i]
        break
      }
    }
    return oldItem
  }

  _isEqualItem(oldItem: TaskModel, id: number) {
    return oldItem.id === id
  }
}
